import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import { Provider, createClient } from "urql";

const client = createClient({
  url: "http://localhost:4000/graphql",
  fetchOptions: {
    // This will actually send a cookie and we'll need this to get the cookie when registering and logging out
    credentials: "include",
  },
});

import theme from "../theme";

function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
