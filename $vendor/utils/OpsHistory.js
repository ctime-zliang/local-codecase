class Ven$OpsHistory {
	constructor(maxSnapshots = 20) {
		this._maxSnapshots = maxSnapshots
		this._snapshots = []
		this._index = -1
	}

	allowRedo() {
		return this._snapshots.length > this._index + 1
	}

	allowUndo() {
		return this._index > 0
	}

	getAllSnapshots() {
		return JSON.parse(JSON.stringify(this._snapshots))
	}

	undo() {
		if (this.allowUndo()) {
			this._index -= 1
			return this._snapshots[this._index]
		}
		return null
	}

	redo() {
		if (this.allowRedo()) {
			this._index += 1
			return this._snapshots[this._index]
		}
		return null
	}

	clear() {
		this._index = -1
		this._snapshots = []
	}

	record(snapshot) {
		while (this._index < this._snapshots.length - 1) {
			this._snapshots.pop()
		}
		this._snapshots.push(snapshot)
		if (this._snapshots.length > this._maxSnapshots) {
			this._snapshots.shift()
		}
		this._index = this._snapshots.length - 1
		return snapshot
	}
}
