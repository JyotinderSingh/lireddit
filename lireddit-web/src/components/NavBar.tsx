import { Box, Button, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
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
          <Link mr={2} color="white" style={{ textDecoration: "none" }}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" style={{ textDecoration: "none" }}>
            Register
          </Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex alignItems="center">
        <Box
          borderRadius="xl"
          padding="0.5rem"
          style={{ textDecoration: "none" }}
          color="white"
          fontWeight="semibold"
        >
          {data.me.username}
        </Box>
        <NextLink href="/create-post">
          <Button
            as={Link}
            ml={4}
            borderRadius="xl"
            padding="0.5rem"
            style={{ textDecoration: "none" }}
            color="white"
            fontWeight="semibold"
            _hover={{
              bg: "teal.500",
            }}
          >
            <Text fontSize="md">Create Post</Text>
          </Button>
        </NextLink>

        <Button
          onClick={() => {
            logout();
            router.reload();
          }}
          as={Link}
          ml={4}
          isLoading={logoutFetching}
          // variant="link"
          style={{ textDecoration: "none" }}
          borderRadius="xl"
          padding="0.5rem"
          color="white"
          fontWeight="semibold"
          _hover={{
            bg: "teal.500",
          }}
        >
          <Text fontSize="md">Logout</Text>
        </Button>
      </Flex>
    );
  }

  // console.log("data: ", data);

  return (
    <Flex
      bg="teal.600"
      p={4}
      position="sticky"
      top={0}
      zIndex={1000}
      alignItems="center"
    >
      <NextLink href="/">
        <Link style={{ textDecoration: "none" }}>
          <Heading color="white" fontWeight="semibold" fontSize="3xl">
            liReddit
          </Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
