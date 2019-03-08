module.exports = {
	simpleJson: {hello: 'world'},
	longJson: (() => {
		const value = {}
		const range = Array.from({length: 100}, (x,i) => i)
		range.forEach(i => value[i.toString()] = "hello world" )
		return value
	})(),
}
