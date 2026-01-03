'use client';
import { ReactNode } from 'react';
import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { makeClient } from '../lib/apollo';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		<ApolloNextAppProvider makeClient={() => makeClient() as any}>
			<ThemeProvider
				attribute="class"
				defaultTheme="dark"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
		</ApolloNextAppProvider>
	);
}

import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
