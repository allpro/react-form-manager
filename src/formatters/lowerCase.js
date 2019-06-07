/**
 * Helper to reformat test as all UPPER-CASE
 */

const formatLowerCase = (text, opts = { ignoreMixedCase: false }) => {
	// handle incorrect data-type, like Null
	if (!text) return ''

	// IGNORE text that is Mixed Case?
	if (opts.ignoreMixedCase) {
		const mixedCase = text !== text.toUpperCase() && text !== text.toLowerCase()
		if (mixedCase) return text
	}

	return text.toLowerCase()
}

export default formatLowerCase
