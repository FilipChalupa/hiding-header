export function hidingHeader(
	container: HTMLElement,
	{
		heightPropertyName = '--hidingHeader-height',
		boundsHeightPropertyName = '--hidingHeader-bounds-height',
		animationOffsetPropertyName = '--hidingHeader-animation-offset',
		snap = true,
	} = {}
) {
	let lastScrollTopPosition = 0
	let lastContentHeight = 0
	let paused = false
	let lastBoundsHeight = 0
	let pointersDown = 0

	const content = container.querySelector('*') as HTMLDivElement
	const parent = container.parentElement
	if (parent === null) {
		throw new Error('Missing parent element.')
	}

	const getContentHeight = () => {
		return content.clientHeight
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
			Math.max(getContentHeight(), rawBoundsHeight)
		)

	const getHeightInsideViewport = () => {
		const contentHeight = getContentHeight()
		const { top } = content.getBoundingClientRect()

		return Math.max(0, Math.min(contentHeight + top, contentHeight))
	}

	const snapIfPossible = () => {
		const contentHeight = getContentHeight()
		const heightInsideViewport = getHeightInsideViewport()
		if (
			snap &&
			heightInsideViewport !== 0 &&
			heightInsideViewport !== contentHeight
		) {
			if (heightInsideViewport < contentHeight / 2) {
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

	const onScroll = () => {
		const globalTopOffset = getGlobalTopOffset()

		// Handle content height
		const contentHeight = getContentHeight()
		if (lastContentHeight !== contentHeight) {
			lastContentHeight = contentHeight
			container.style.setProperty(heightPropertyName, `${lastContentHeight}px`)
		}

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
		const contentHeight = getContentHeight()
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

	return {
		run,
		pause,
		isPaused,
		reveal,
		hide,
	}
}
