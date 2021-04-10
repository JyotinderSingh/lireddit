import { Box, Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    // This tells the Next js server to not run this query while SSR'ing a page, since it will
    // anyway not have the user cookie required to run this query - and in the end will just be an
    // extra request. (We could set it up to get the query, but it will just be an extra request that's not needed)
    // *
    // the pause value is true when it's running on a server, otherwise it's false (on user's system) hence the query
    // is run when it's on the user's machine
    pause: isServer(),
  });

  let body = null;

  // data is loading
  if (fetching) {
    body = null;

    // user is not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2} color="white">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white">Register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={4} color="white">
          {data.me.username}
        </Box>
        <Button
          onClick={() => {
            logout();
          }}
          isLoading={logoutFetching}
          variant="link"
        >
          Logout
        </Button>
      </Flex>
    );
  }

  // console.log("data: ", data);

  return (
    <Flex bg="teal.600" p={4} position="sticky" top={0} zIndex={1000}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
