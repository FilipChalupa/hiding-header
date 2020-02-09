export function hidingHeader(container: HTMLElement) {
	const DEFAULT_CONTENT_SELECTOR = '*'
	const DEFAULT_HEIGHT_PROPERTY_NAME = '--hidingHeader-height'
	const DEFAULT_SCROLL_CAP_PROPERTY_NAME = '--hidingHeader-scrollCap'

	const contentSelector = DEFAULT_CONTENT_SELECTOR
	const heightPropertyName = DEFAULT_HEIGHT_PROPERTY_NAME
	const scrollCapPropertyName = DEFAULT_SCROLL_CAP_PROPERTY_NAME

	let lastScrollTop = 0
	let contentHeight = 0
	let wasScrollingDown = true
	let lastScrollCap = 0

	const content = container.querySelector(contentSelector)
	if (content === null) {
		throw new Error(`Content '${contentSelector}' not found in container.`)
	}

	const getContentHeight = () => {
		return content.clientHeight
	}

	const onScroll = () => {
		const currentContentHeight = getContentHeight() // @TODO: throttle/cache
		if (contentHeight !== currentContentHeight) {
			contentHeight = currentContentHeight
			container.style.setProperty(heightPropertyName, `${contentHeight}px`)
		}

		const scrollTop = window.scrollY
		const isScrollingDown = scrollTop > lastScrollTop
		if (isScrollingDown !== wasScrollingDown) {
			const scrollCap = isScrollingDown
				? scrollTop
				: Math.max(0, scrollTop - contentHeight)

			// @TODO: handle changes in scroll direction if header is partially visible

			if (scrollCap !== lastScrollCap) {
				wasScrollingDown = isScrollingDown
				container.style.setProperty(scrollCapPropertyName, `${scrollCap}px`)
				lastScrollCap = scrollCap
			}
		}
		lastScrollTop = scrollTop
	}

	const onResize = onScroll

	const initialize = () => {
		window.addEventListener('scroll', onScroll)
		window.addEventListener('resize', onResize)
		onScroll()
	}

	initialize()
}
