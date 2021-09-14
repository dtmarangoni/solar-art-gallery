/**
 * General utility methods.
 */

/**
 * Utility method to remove the userId property from an object. Useful
 * for request responses.
 * @param obj The generic object.
 * @returns The new object without the userId property.
 */
export function rmUserId<T extends { userId: string }>(obj: T): Omit<T, 'userId'> {
    const { userId, ...newObj } = obj;
    return newObj;
}

/**
 * Utility method to remove the userId property from an array of
 * objects. Useful for request responses.
 * @param objs The generic array of objects.
 * @returns The objects array without the userId property.
 */
export function rmUserIdFromArr<T extends { userId: string }>(objs: T[]): Omit<T, 'userId'>[] {
    return objs.map((obj) => {
        const { userId, ...newObj } = obj;
        return newObj;
    });
}
