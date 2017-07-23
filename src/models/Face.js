import { Vector } from './Vector';

const faceToNormal = {
	front: '0 0 1',
	right: '1 0 0',
	up: '0 1 0',
	down: '0 -1 0',
	left: '-1 0 0',
	back: '0 0 -1'
};

class Face {
	/**
	 * Factory method.
	 * @param {string|array} normal - The normal that identifies this face.
	 * @return {Face}
	 */
	static FromNormal(normal) {
		if (typeof normal === 'string') {
			normal = Vector.FromString(normal).toArray();
		}

		return new Face(Face.getFace(normal));
	}

	/**
	 * @param {string} face - A string that identifies a face.
	 * @return {array}
	 */
	static getNormal(face) {
		return Vector.FromString(faceToNormal[face]).toArray();
	}

	/**
	 * @param {string|array} normal - The normal that identifies a face.
	 * @return {string}
	 */
	static getFace(normal) {
		if (typeof normal === 'string') {
			normal = Vector.FromString(normal).toArray();
		}

		for (let face of Object.keys(faceToNormal)) {
			if (normal.join(' ') === faceToNormal[face]) {
				return face;
			}
		}
	}

	/**
	 * @param {string} face - The string of a face, e.g. 'RIGHT'.
	 */
	constructor(face) {
		if (typeof face !== 'string') {
			throw new Error(`"face" must be a string (received: ${face})`);
		}

		face = face.toLowerCase();

		this.vector = Vector.FromString(faceToNormal[face]);
	}

	/**
	 * Method to return the normal as an array.
	 * @return {array}
	 */
	normal() {
		return this.vector.toArray();
	}

	/**
	 * @return {string}
	 */
	toString() {
		return Face.getFace(this.normal());
	}

	/**
	 * Simulates an orientation change where this face becomes the new given face.
	 * NOTE: this only changes this face's normals, not any cubies' positions.
	 * @param {string|Face} face - The new face, e.g. 'FRONT'
	 */
	orientTo(newFace) {
		if (typeof newFace === 'string') {
			newFace = new Face(newFace);
		}

		let { axis, angle } = Vector.getRotationFromNormals(this.normal(), newFace.normal());
		this.vector.rotate(axis, angle);
		return this;
	}

	/**
	 * Convenience method for rotating this face. NOTE: this only changes this
	 * face's normals, not any cubies' positions.
	 * @param {string} axis - Axis of rotation.
	 * @param {number} angle - Angle of rotation.
	 * @return {Face}
	 */
	rotate(axis, angle) {
		this.vector.rotate(axis, angle);
		return this;
	}
}

Face.FRONT = new Face('FRONT');
Face.RIGHT = new Face('RIGHT');
Face.UP = new Face('UP');
Face.DOWN = new Face('DOWN');
Face.LEFT = new Face('LEFT');
Face.BACK = new Face('BACK');

export { Face };
