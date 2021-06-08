/**
 * General utility methods.
 */

import { Album } from '../models/database/Album';
import { Art } from '../models/database/Art';

/**
 * Utility method to remove the userId property from an Album or Art
 * item. Useful for request responses.
 * @param item The Album or Art item.
 * @returns The new item without the userId property.
 */
export function rmUserId(item: Album | Art) {
    const { userId, ...newItem } = item;
    return newItem;
}

/**
 * Utility method to remove the userId property from an array of
 * Albums or Arts items. Useful for request responses.
 * @param items The Albums or Arts items.
 * @returns The new items array without the userId property.
 */
export function rmUserIdFromArr(items: Album[] | Art[]) {
    return items.map((item: Album | Art) => {
        const { userId, ...newItem } = item;
        return newItem;
    });
}
