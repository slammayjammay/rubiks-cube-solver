import cross from 'gl-vec3/cross';
import { Face } from '../models/Face';
import { Vector } from '../models/Vector';

// maps each face with the notation for their middle moves
const _middlesMatchingFace = {
	f: 's',
	r: 'mprime',
	u: 'eprime',
	d: 'e',
	l: 'm',
	b: 'sprime'
};

/**
 * @param {string} move - The notation of a move, e.g. rPrime.
 * @return {string}
 */
export const getFaceOfMove = (move) => {
	if (typeof move !== 'string') {
		throw new TypeError('move must be a string');
	}

	let faceLetter = move[0].toLowerCase();

	if (faceLetter === 'f') return 'front';
	if (faceLetter === 'r') return 'right';
	if (faceLetter === 'u') return 'up';
	if (faceLetter === 'd') return 'down';
	if (faceLetter === 'l') return 'left';
	if (faceLetter === 'b') return 'back';
};

/**
 * Almost useless. Almost.
 * @param {string} face - The string identifying a face.
 * @return {string}
 */
export const getMoveOfFace = (face) => {
	if (typeof face !== 'string') {
		throw new TypeError('face must be a string');
	}

	face = face.toLowerCase();

	if (!['front', 'right', 'up', 'down', 'left', 'back'].includes(face)) {
		throw new Error(`${face} is not valid face`);
	}

	return face[0];
};

export const getMiddleMatchingFace = (face) => {
	face = face.toLowerCase()[0];
	return _middlesMatchingFace[face];
};

export const getFaceMatchingMiddle = (middle) => {
	middle = middle.toLowerCase();

	for (let face of Object.keys(_middlesMatchingFace)) {
		let testMiddle = _middlesMatchingFace[face];
		if (middle === testMiddle) {
			return face;
		}
	}
};

/**
 * @param {string|array} notations - The move notation.
 * @param {object} options - Move options.
 * @prop {boolean} options.upperCase - Turn all moves to upper case (i.e. no "double" moves).
 *
 * @return {string|array} -- whichever was initially given.
 */
export const transformNotations = (notations, options = {}) => {
	let normalized = normalizeNotations(notations);

	if (options.upperCase) {
		normalized = normalized.map(n => n[0].toUpperCase() + n.slice(1));
	}

	if (options.orientation) {
		normalized = orientMoves(normalized, options.orientation);
	}

	if (options.reverse) {
		normalized = _reverseNotations(normalized);
	}

	return typeof notations === 'string' ? normalized.join(' ') : normalized;
};

/**
 * @param {array|string} notations - The notations to noramlize.
 * @return {array}
 */
export const normalizeNotations = (notations) => {
	if (typeof notations === 'string') {
		notations = notations.split(' ');
	}

	notations = notations.filter(notation => notation !== '');

	return notations.map(notation => {
		let isPrime = notation.toLowerCase().includes('prime');
		let isDouble = notation.includes('2');

		notation = notation[0];

		if (isDouble) notation = notation[0] + '2';
		else if (isPrime) notation = notation + 'prime';

		return notation;
	});
};

/**
 * Finds the direction from an origin face to a target face. The origin face
 * will be oriented so that it becomes FRONT. An orientation object must be
 * provided that specifies any of these faces (exclusively): TOP, RIGHT, DOWN,
 * LEFT.
 * If FRONT or BACK is provided along with one of those faces, it will be
 * ignored. If FRONT or BACK is the only face provided, the orientation is
 * ambiguous and an error will be thrown.
 *
 * Example:
 * getDirectionFromFaces('back', 'up', { down: 'right' })
 * Step 1) orient the BACK face so that it becomes FRONT.
 * Step 2) orient the DOWN face so that it becomes RIGHT.
 * Step 3) Find the direction from BACK (now FRONT) to UP (now LEFT).
 * Step 4) Returns 'left'.
 *
 * @param {string} origin - The origin face.
 * @param {string} target - The target face.
 * @param {object} orientation - The object that specifies the cube orientation.
 * @return {string|number}
 */
export const getDirectionFromFaces = (origin, target, orientation) => {
	orientation = _toLowerCase(orientation);
	orientation = _prepOrientationForDirection(orientation, origin);

	let fromFace = new Face(origin);
	let toFace = new Face(target);

	let rotations = _getRotationsForOrientation(orientation);
	_rotateFacesByRotations([fromFace, toFace], rotations);

	let axis = new Vector(cross([], fromFace.normal(), toFace.normal())).getAxis();
	let direction = Vector.getAngle(fromFace.normal(), toFace.normal());

	if (axis === 'x' && direction > 0) return 'down';
	if (axis === 'x' && direction < 0) return 'up';
	if (axis === 'y' && direction > 0) return 'right';
	if (axis === 'y' && direction < 0) return 'left';

	if (direction === 0) {
		return 'front';
	} else if (direction === Math.PI) {
		return 'back';
	}
};

/**
 * See `getDirectionFromFaces`. Almost identical, but instead of finding a
 * direction from an origin face and target face, this finds a target face from
 * an origin face and direction.
 * @param {string} origin - The origin face.
 * @param {string} direction - The direction.
 * @param {object} orientation - The orientation object.
 * @return {string}
 */
export const getFaceFromDirection = (origin, direction, orientation) => {
	orientation = _toLowerCase(orientation);
	orientation = _prepOrientationForDirection(orientation, origin);

	let fromFace = new Face(origin);

	let rotations = _getRotationsForOrientation(orientation);
	_rotateFacesByRotations([fromFace], rotations);

	let directionFace = new Face(direction);
	let { axis, angle } = Vector.getRotationFromNormals(fromFace.normal(), directionFace.normal());
	fromFace.rotate(axis, angle);

	// at this point fromFace is now the target face, but we still need to revert
	// the orientation to return the correct string
	let reversedRotations = rotations.map(rotation => Vector.reverseRotation(rotation)).reverse();
	_rotateFacesByRotations([fromFace], reversedRotations);
	return fromFace.toString();
};

/**
 * Finds a move that rotates the given face around its normal, by the angle
 * described by normal1 -> normal2.
 * @param {string} face - The face to rotate.
 * @param {string} from - The origin face.
 * @param {string} to - The target face.
 * @return {string}
 */
export const getRotationFromTo = (face, from, to) => {
	const rotationFace = new Face(face);
	const fromFace = new Face(from);
	const toFace = new Face(to);

	let rotationAxis = rotationFace.vector.getAxis();
	let [fromAxis, toAxis] = [fromFace.vector.getAxis(), toFace.vector.getAxis()];

	if ([fromAxis.toLowerCase(), toAxis.toLowerCase()].includes(rotationAxis.toLowerCase())) {
		throw new Error(`moving ${rotationFace} from ${fromFace} to ${toFace} is not possible.`);
	}

	let move = getMoveOfFace(face).toUpperCase();
	let angle = Vector.getAngle(fromFace.normal(), toFace.normal());
	if (rotationFace.vector.getMagnitude() < 0) {
		angle *= -1;
	}

	if (angle === 0) {
		return '';
	} else if (Math.abs(angle) === Math.PI) {
		return `${move} ${move}`;
	} else if (angle < 0) {
		return `${move}`;
	} else if (angle > 0) {
		return `${move}Prime`;
	}
};

/**
 * Returns an array of transformed notations so that if done when the cube's
 * orientation is default (FRONT face is FRONT, RIGHT face is RIGHT, etc.), the
 * moves will have the same effect as performing the given notations on a cube
 * oriented by the specified orientation.
 *
 * Examples:
 * orientMoves(['R', 'U'], { front: 'front', up: 'up' })      === ['R', 'U']
 * orientMoves(['R', 'U'], { front: 'front', down: 'right' }) === ['U', 'L']
 * orientMoves(['R', 'U', 'LPrime', 'D'], { up: 'back', right: 'down' }) === ['D', 'B', 'UPrime', 'F']
 *
 * @param {array} notations - An array of notation strings.
 * @param {object} orientation - The orientation object.
 */
export const orientMoves = (notations, orientation) => {
	orientation = _toLowerCase(orientation);
	let rotations = _getRotationsForOrientation(orientation);
	rotations.reverse().map(rotation => Vector.reverseRotation(rotation));

	return notations.map(notation => {
		let isPrime = notation.toLowerCase().includes('prime');
		let isDouble = notation.includes('2');
		let isWithMiddle = notation[0] === notation[0].toLowerCase();
		let isMiddle = ['m', 'e', 's'].includes(notation[0].toLowerCase());

		if (isDouble) {
			notation = notation.replace('2', '');
		}

		let face;

		if (isMiddle) {
			let faceStr = getFaceOfMove(getFaceMatchingMiddle(notation));
			face = new Face(faceStr);
		} else {
			let faceStr = getFaceOfMove(notation[0]);
			face = new Face(faceStr);
		}

		_rotateFacesByRotations([face], rotations);

		let newNotation; // this will always be lower case

		if (isMiddle) {
			newNotation = getMiddleMatchingFace(face.toString());
		} else {
			newNotation = face.toString()[0];
		}

		if (!isWithMiddle) newNotation = newNotation.toUpperCase();
		if (isDouble) newNotation = newNotation + '2';
		if (isPrime && !isMiddle) newNotation += 'prime';

		return newNotation;
	});
};

//-----------------
// Helper functions
//-----------------

/**
 * Returns an object with all keys and values lowercased. Assumes all keys and
 * values are strings.
 * @param {object} object - The object to map.
 */
function _toLowerCase(object) {
	let ret = {};
	Object.keys(object).forEach(key => {
		ret[key.toLowerCase()] = object[key].toLowerCase();
	});
	return ret;
}

/**
 * This function is specificly for `getDirectionFromFaces` and
 * `getFaceFromDirection`. It removes all keys that are either 'front' or 'back'
 * and sets the given front face to orientation.front.
 * @param {object} orientation - The orientation object.
 * @param {string} front - The face to set as front.
 */
function _prepOrientationForDirection(orientation, front) {
	let keys = Object.keys(orientation);

	if (keys.length <= 1 && ['front', 'back'].includes(keys[0])) {
		throw new Error(`Orientation object "${orientation}" is ambiguous. Please specify one of these faces: "up", "right", "down", "left"`);
	}

	// remove "front" and "back" from provided orientation object
	let temp = orientation;
	orientation = {};

	keys.forEach(key => {
		if (['front', 'back'].includes(key)) {
			return;
		}
		orientation[key] = temp[key];
	});

	orientation.front = front.toLowerCase();

	return orientation;
}

/**
 * @param {object} orientation - The orientation object.
 * @return {array}
 */
function _getRotationsForOrientation(orientation) {
	if (Object.keys(orientation) <= 1) {
		throw new Error(`Orientation object "${orientation}" is ambiguous. Please specify 2 faces.`);
	}

	let keys = Object.keys(orientation);
	let origins = keys.map(key => new Face(orientation[key]));
	let targets = keys.map(key => new Face(key));

	// perform the first rotation, and save it
	let rotation1 = Vector.getRotationFromNormals(
		origins[0].normal(),
		origins[0].orientTo(targets[0]).normal()
	);

	// perform the first rotation on the second origin face
	origins[1].rotate(rotation1.axis, rotation1.angle);

	// peform the second rotation, and save it
	let rotation2 = Vector.getRotationFromNormals(
		origins[1].normal(),
		origins[1].orientTo(targets[1]).normal()
	);

	// if the rotation angle is PI, there are 3 possible axes that can perform the
	// rotation. however only one axis will perform the rotation while keeping
	// the first origin face on the target. this axis is the same as the origin
	// face's normal.
	if (Math.abs(rotation2.angle) === Math.PI) {
		let rotation2Axis = new Face(keys[0]).vector.getAxis();
		rotation2.axis = rotation2Axis;
	}

	return [rotation1, rotation2];
}

/**
 * @param {array} - Array of Face objects to rotate.
 * @param {array} - Array of rotations to apply to faces.
 * @return {null}
 */
function _rotateFacesByRotations(faces, rotations) {
	for (let face of faces) {
		for (let rotation of rotations) {
			face.rotate(rotation.axis, rotation.angle);
		}
	}
}

/**
 * @param {array} notations
 * @return {array}
 */
function _reverseNotations(notations) {
	const reversed = [];

	for (let notation of notations) {
		let isPrime = notation.includes('prime');
		notation = isPrime ? notation[0] : notation[0] + 'prime';
		reversed.push(notation);
	}

	return typeof moves === 'string' ? reversed.join(' ') : reversed;
}

export default {
	getFaceOfMove,
	getMoveOfFace,
	getMiddleMatchingFace,
	getFaceMatchingMiddle,
	transformNotations,
	normalizeNotations,
	getDirectionFromFaces,
	getRotationFromTo,
	getFaceFromDirection,
	orientMoves
};

