# Hiding Header [![npm](https://img.shields.io/npm/v/hiding-header.svg)](https://www.npmjs.com/package/hiding-header) [![Dependencies](https://img.shields.io/david/FilipChalupa/hiding-header.svg)](https://www.npmjs.com/package/hiding-header?activeTab=dependencies) ![npm type definitions](https://img.shields.io/npm/types/hiding-header.svg)

Toggles header visibility on scroll. [Demo](https://raw.githack.com/FilipChalupa/hiding-header/master/demo.html).

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
			<div class="hidingHeader-content">
				<!-- Your header -->
			</div>
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
	--hidingHeader-height: 0px;
	--hidingHeader-bounds-height: 0px;
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
}

.hidingHeader-content {
	pointer-events: auto;
}
```

### JavaScript:

```javascript
import { hidingHeader } from 'hiding-header'

const container = document.querySelector('#hidingHeader')
hidingHeader(container)
```
