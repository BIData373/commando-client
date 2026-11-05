type PathDepth = [never, 0, 1, 2]

/** Dot-separated paths into `T` that resolve to a string, nested up to three levels */
export type StringPath<T, TDepth extends number = 3> = [TDepth] extends [never]
	? never
	: {
			[K in keyof T & string]: NonNullable<T[K]> extends string
				? K
				: NonNullable<T[K]> extends Date | readonly unknown[]
					? never
					: NonNullable<T[K]> extends object
						? `${K}.${StringPath<NonNullable<T[K]>, PathDepth[TDepth]>}`
						: never
		}[keyof T & string]
