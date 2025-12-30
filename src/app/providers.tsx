'use client';
import { ReactNode } from 'react';
import { ApolloNextAppProvider } from '@apollo/client-integration-nextjs';
import { makeClient } from '../lib/apollo';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ApolloNextAppProvider makeClient={() => makeClient()}>
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
