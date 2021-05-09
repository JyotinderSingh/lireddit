import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";

interface EditDeletePostButtonsProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButtons: React.FC<EditDeletePostButtonsProps> = ({
  id,
  creatorId,
}) => {
  const { data: meData } = useMeQuery();

  const [deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Flex alignItems="end" mt={2}>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          ml="auto"
          as={Link}
          aria-label="delete button"
          variant="ghost"
          colorScheme="blue"
          padding={2}
          icon={<EditIcon />}
        ></IconButton>
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({
            variables: { id },
            update: (cache) => {
              // <Name of the type>:<ID of the object>
              // Post:77
              cache.evict({ id: "Post:" + id });
            },
          });
        }}
        ml={1}
        aria-label="delete button"
        variant="ghost"
        colorScheme="red"
        padding={2}
        icon={<DeleteIcon />}
      ></IconButton>
    </Flex>
  );
};
