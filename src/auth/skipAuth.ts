import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 *
 * @description if a route needs to be public/accessible without a token use this decorator
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
