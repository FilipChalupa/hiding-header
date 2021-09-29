export interface HidingHeaderOptions {
	snap?: boolean // Reveal or hide header if user stops scrolling in middle
	onHeightChange?: (height: number) => void // When content height changes
	onVisibleHeightChange?: (visibleHeight: number) => {} // When part of header is revealed
	onIsAtInitialPositionChange?: (isAtInitialPosition: boolean) => void // When returns to or leaves initial position
}

export const hidingHeader = (
	containerElement: HTMLElement,
	options: HidingHeaderOptions = {}
) => {
	const {
		snap = true,
		onHeightChange = () => {},
		onVisibleHeightChange = () => {},
		onIsAtInitialPositionChange = () => {},
	} = options

	const contentElement = containerElement.querySelector('*') // Direct descendant

	const reveal = () => {
		console.log('@TODO')
	}

	const hide = () => {
		console.log('@TODO')
	}

	const height = () => {
		console.log('@TODO')
	}

	const visibleHeight = () => {
		console.log('@TODO')
	}

	const isAtInitialPosition = () => {
		console.log('@TODO')
	}

	const keepRevealed = (revealed = true) => {
		console.log('@TODO')
	}

	return {
		reveal,
		hide,
		height,
		visibleHeight,
		isAtInitialPosition,
	}
}
