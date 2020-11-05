# Hiding Header [![npm](https://img.shields.io/npm/v/hiding-header.svg)](https://www.npmjs.com/package/hiding-header) [![Dependencies](https://img.shields.io/david/FilipChalupa/hiding-header.svg)](https://www.npmjs.com/package/hiding-header?activeTab=dependencies) ![npm type definitions](https://img.shields.io/npm/types/hiding-header.svg)

Toggles header visibility on scroll. [Demo](https://filipchalupa.cz/hiding-header/demo).

![UI example](https://raw.githubusercontent.com/FilipChalupa/hiding-header/HEAD/screencast.gif)

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

### React component

For more information see [hiding-header-react](https://www.npmjs.com/package/hiding-header-react).
