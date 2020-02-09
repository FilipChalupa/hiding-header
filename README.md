# Hiding Header [![npm](https://img.shields.io/npm/v/hiding-header.svg)](https://www.npmjs.com/package/hiding-header) [![David](https://img.shields.io/david/onset/hiding-header.svg)](https://www.npmjs.com/package/hiding-header?activeTab=dependencies) ![npm type definitions](https://img.shields.io/npm/types/hiding-header.svg)

Toggles header visibility.

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
	--hidingHeader-scrollCap: 0px;
	z-index: 10;
	min-height: calc(var(--hidingHeader-scrollCap) + var(--hidingHeader-height));
	margin-bottom: calc(-1 * var(--hidingHeader-scrollCap));
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
