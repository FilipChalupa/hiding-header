export function hidingHeader(
	container: HTMLElement,
	{
		contentSelector = '*',
		heightPropertyName = '--hidingHeader-height',
		boundsHeightPropertyName = '--hidingHeader-bounds-height',
		animationOffsetPropertyName = '--hidingHeader-animation-offset',
	} = {}
) {
	let lastScrollTopPosition = 0
	let lastContentHeight = 0
	let paused = false
	let lastBoundsHeight = 0

	const content = container.querySelector(contentSelector)
	if (!(content instanceof HTMLElement)) {
		throw new Error(`Content '${contentSelector}' not found in container.`)
	}

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
		}

		lastScrollTopPosition = scrollTopPosition
	}

	const onResize = onScroll

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
