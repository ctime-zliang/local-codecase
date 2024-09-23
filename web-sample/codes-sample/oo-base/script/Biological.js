function Biological(type) {
	this.type = type
	this.originalName = `-`
	/* 引用类型的属性 */
	this.features = [`move`]
	/* 本地方法 */
	this.talk = function () {
		return `I can talk.`
	}
}

Biological.prototype.phyComposition = [`heart*1`]
Biological.prototype.ptt = `Biological PTT`

Biological.prototype.eat = function () {
	return `A(n) ${this.type} his name is ${this.getName()} is eating.`
}

Biological.prototype.breathing = function () {
	return `A(n) ${this.type} his name is ${this.getName()} is breathing.`
}

Biological.prototype.setOriginalName = function (name) {
	this.originalName = name
}

Biological.prototype.getName = function () {
	return this.name || this.originalName
}
