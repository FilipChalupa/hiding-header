export function hidingHeader(container: HTMLElement) {
	const DEFAULT_CONTENT_SELECTOR = '*'
	const DEFAULT_HEIGHT_PROPERTY_NAME = '--hidingHeader-height'
	const DEFAULT_SCROLL_CAP_PROPERTY_NAME = '--hidingHeader-scrollCap'
	const DEFAULT_TOP_OFFSET_PROPERTY_NAME = '--hidingHeader-topOffset'

	const contentSelector = DEFAULT_CONTENT_SELECTOR
	const heightPropertyName = DEFAULT_HEIGHT_PROPERTY_NAME
	const scrollCapPropertyName = DEFAULT_SCROLL_CAP_PROPERTY_NAME
	const topOffsetPropertyName = DEFAULT_TOP_OFFSET_PROPERTY_NAME

	let lastScrollTopPosition = 0
	let contentHeight = 0
	let lastScrollCap = 0
	let topOffset = 0
	let paused = false

	const content = container.querySelector(contentSelector)
	if (content === null) {
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

	const getTopOffset = () => {
		return container.offsetTop
	}

	const getContainerOffset = () => {
		return container.getBoundingClientRect().top
	}

	const onScroll = () => {
		const parentHeight = getParentHeight()
		const containerOffset = getContainerOffset()

		// Handle top offset
		const currentTopOffset = getTopOffset()
		if (topOffset !== currentTopOffset) {
			topOffset = currentTopOffset
			container.style.setProperty(
				topOffsetPropertyName,
				`${currentTopOffset}px`
			)
		}

		// Handle content height
		const currentContentHeight = getContentHeight()
		if (contentHeight !== currentContentHeight) {
			contentHeight = currentContentHeight
			container.style.setProperty(heightPropertyName, `${contentHeight}px`)
		}

		// Handle scroll cap
		const scrollTopPosition = window.scrollY
		const isScrollingDown = scrollTopPosition > lastScrollTopPosition

		if (!paused) {
			// @TODO: fix offset variant on direction change
			const scrollCap = Math.min(
				parentHeight - contentHeight,
				(() => {
					const scrollCapBottomPosition =
						lastScrollTopPosition +
						containerOffset +
						lastScrollCap +
						contentHeight
					if (isScrollingDown) {
						const newScrollCap = scrollTopPosition - contentHeight
						return scrollCapBottomPosition < scrollTopPosition
							? newScrollCap
							: lastScrollCap
					} else {
						const newScrollCap = scrollTopPosition
						return newScrollCap < scrollCapBottomPosition - contentHeight
							? newScrollCap
							: lastScrollCap
					}
				})()
			)
			if (scrollCap !== lastScrollCap) {
				container.style.setProperty(scrollCapPropertyName, `${scrollCap}px`)
				lastScrollCap = scrollCap
			}
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

	return {
		run,
		pause,
		isPaused,
	}
}
