export interface HidingHeaderOptions {
	heightPropertyName?: string
	boundsHeightPropertyName?: string
	animationOffsetPropertyName?: string
	snap?: boolean
	onHeightChange?: (height: number) => void
	onVisibleHeightChange?: (height: number) => void
}

export function hidingHeader(
	container: HTMLElement,
	{
		heightPropertyName = '--hidingHeader-height',
		boundsHeightPropertyName = '--hidingHeader-bounds-height',
		animationOffsetPropertyName = '--hidingHeader-animation-offset',
		snap = true,
		onHeightChange = () => {},
		onVisibleHeightChange = () => {},
	}: HidingHeaderOptions = {}
) {
	const content = container.querySelector('*') as HTMLDivElement

	let lastScrollTopPosition = 0

	let contentHeight = (() => {
		const getContentHeight = () => content.clientHeight
		const setContentHeightProperty = (height: number) => {
			container.style.setProperty(heightPropertyName, `${height}px`)
		}

		const resizeObserver = new ResizeObserver(() => {
			const newContentHeight = getContentHeight()
			if (contentHeight !== newContentHeight) {
				contentHeight = newContentHeight
				setContentHeightProperty(contentHeight)
				onScroll()
				onHeightChange(contentHeight)
			}
		})
		resizeObserver.observe(content)

		const initialHeight = getContentHeight()
		setContentHeightProperty(initialHeight)
		return initialHeight
	})()

	let visibleHeight = contentHeight

	let paused = false
	let lastBoundsHeight = 0
	let pointersDown = 0
	const parent = container.parentElement
	if (parent === null) {
		throw new Error('Missing parent element.')
	}

	const getParentHeight = () => {
		return parent.clientHeight
	}

	const getGlobalTopOffset = () => {
		return container.offsetTop
	}

	const getRelativeTopOffset = () => {
		return getGlobalTopOffset() - (container.parentElement?.offsetTop || 0)
	}

	const animateOffset = (initialOffset: number) => {
		if (initialOffset === 0) {
			return // Nothing to animate
		}

		content.style.transition = 'none'
		container.style.setProperty(
			animationOffsetPropertyName,
			`${initialOffset}px`
		)

		content.offsetHeight // Trigger transition

		content.style.transition = ''
		container.style.setProperty(animationOffsetPropertyName, '0px')
	}

	const updateBoundsHeight = (boundsHeight: number) => {
		if (boundsHeight !== lastBoundsHeight) {
			container.style.setProperty(boundsHeightPropertyName, `${boundsHeight}px`)
			lastBoundsHeight = boundsHeight
		}
	}

	const capBoundsHeight = (rawBoundsHeight: number) =>
		Math.min(
			getParentHeight() - getRelativeTopOffset(),
			Math.max(contentHeight, rawBoundsHeight)
		)

	const snapIfPossible = () => {
		if (snap && visibleHeight !== 0 && visibleHeight !== contentHeight) {
			if (visibleHeight < contentHeight / 2) {
				hide()
			} else {
				reveal()
			}
		}
	}

	const onScrollStopDebounced = (() => {
		let timer: number

		return () => {
			window.clearTimeout(timer)
			timer = window.setTimeout(() => {
				if (snap && pointersDown === 0) {
					snapIfPossible()
				}
			}, 100)
		}
	})()

	const updateVisibleHeight = () => {
		visibleHeight = (() => {
			const { top } = content.getBoundingClientRect()
			const newVisibleHeight = Math.max(
				0,
				Math.min(contentHeight + top, contentHeight)
			)

			if (visibleHeight !== newVisibleHeight) {
				onVisibleHeightChange(newVisibleHeight)
			}

			return newVisibleHeight
		})()
	}

	const onTransitioning = () => {
		updateVisibleHeight()
	}

	;(() => {
		let running = false
		const loop = () => {
			if (!running) {
				return
			}
			onTransitioning()
			requestAnimationFrame(loop)
		}
		content.addEventListener('transitionstart', () => {
			running = true
			loop()
		})
		content.addEventListener('transitionend', () => {
			running = false
			onTransitioning()
		})
	})()

	const onScroll = () => {
		const globalTopOffset = getGlobalTopOffset()

		// Handle bounds height
		const scrollTopPosition = window.scrollY
		const isScrollingDown = scrollTopPosition > lastScrollTopPosition

		if (!paused) {
			const boundsHeight = capBoundsHeight(
				(() => {
					if (isScrollingDown) {
						const newBoundsHeight = scrollTopPosition - globalTopOffset
						if (lastBoundsHeight < newBoundsHeight) {
							return newBoundsHeight
						}
						return lastBoundsHeight
					} else {
						const newBoundsHeight =
							scrollTopPosition - globalTopOffset + contentHeight
						if (lastBoundsHeight > newBoundsHeight) {
							return newBoundsHeight
						}
						return lastBoundsHeight
					}
				})()
			)

			updateBoundsHeight(boundsHeight)

			onScrollStopDebounced()

			updateVisibleHeight()
		}

		lastScrollTopPosition = scrollTopPosition
	}

	const onResize = onScroll

	document.addEventListener('pointerdown', () => {
		pointersDown++
		onScroll()
	})

	document.addEventListener('pointerup', () => {
		pointersDown--
		onScroll()
	})

	const initialize = () => {
		window.addEventListener('scroll', onScroll)
		window.addEventListener('resize', onResize)
		onScroll()
	}

	initialize()

	const run = () => {
		paused = false
	}
	const pause = () => {
		paused = true
	}
	const isPaused = () => {
		return paused
	}

	const reveal = () => {
		const scrollTopPosition = window.scrollY

		const globalTopOffset = getGlobalTopOffset()

		const boundsHeight = capBoundsHeight(
			scrollTopPosition - globalTopOffset + contentHeight
		)

		animateOffset(lastBoundsHeight - boundsHeight)
		updateBoundsHeight(boundsHeight)
	}

	const hide = () => {
		const scrollTopPosition = window.scrollY
		const globalTopOffset = getGlobalTopOffset()

		const boundsHeight = capBoundsHeight(scrollTopPosition - globalTopOffset)

		animateOffset(lastBoundsHeight - boundsHeight)
		updateBoundsHeight(boundsHeight)
	}

	const getHeight = () => contentHeight
	const getVisibleHeight = () => visibleHeight

	return {
		run,
		pause,
		isPaused,
		reveal,
		hide,
		getHeight,
		getVisibleHeight,
	}
}
