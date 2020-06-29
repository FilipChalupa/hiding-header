# Hiding Header [![npm](https://img.shields.io/npm/v/hiding-header.svg)](https://www.npmjs.com/package/hiding-header) [![Dependencies](https://img.shields.io/david/FilipChalupa/hiding-header.svg)](https://www.npmjs.com/package/hiding-header?activeTab=dependencies) ![npm type definitions](https://img.shields.io/npm/types/hiding-header.svg)

Toggles header visibility on scroll. [Demo](https://raw.githack.com/FilipChalupa/hiding-header/master/demo.html).

![UI example](./screencast.gif)

## Installation

```bash
npm install hiding-header
```

## How to use

### HTML:

```html
<!-- … -->
<body>
	<div class="hidingHeader" id="hidingHeader">
		<div class="hidingHeader-in">
			<!-- Your header -->
		</div>
	</div>
	<!-- … -->
</body>
<!-- … -->
```

### CSS:

```css
.hidingHeader {
	position: relative;
	--hidingHeader-height: auto;
	--hidingHeader-bounds-height: auto;
	z-index: 10;
	height: var(--hidingHeader-bounds-height);
	margin-bottom: calc(
		var(--hidingHeader-height) - var(--hidingHeader-bounds-height)
	);
	pointer-events: none;
}

.hidingHeader-in {
	position: relative;
	position: sticky;
	top: 0;
	pointer-events: auto;
}
```

### JavaScript:

```javascript
import { hidingHeader } from 'hiding-header'

const container = document.querySelector('#hidingHeader')
hidingHeader(container)
```

### React component (HTML alternative)

```jsx
import React, { useEffect } from 'react'
import { hidingHeader } from 'hiding-header'

export const HidingHeader = (props) => {
	const container = React.useRef()

	useEffect(() => {
		hidingHeader(container.current)
	}, [])

	return (
		<div className="hidingHeader" ref={container}>
			<div className="hidingHeader-in">{props.children}</div>
		</div>
	)
}
```
