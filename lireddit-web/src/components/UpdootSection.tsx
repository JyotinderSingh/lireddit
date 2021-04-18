import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

interface UpdootSectionProps {
  // post: PostsQuery["posts"]["posts"][0];
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");
  const [, vote] = useVoteMutation();
  return (
    <Flex direction="column" alignItems="center" justifyContent="center" mr={5}>
      <IconButton
        onClick={async () => {
          // if (post.voteStatus === 1) {
          //   return;
          // }
          setLoadingState("updoot-loading");
          await vote({
            postId: post.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot"
        icon={<ChevronUpIcon boxSize="24px" />}
        mb={2}
        size="sm"
        bgColor={post.voteStatus === 1 ? "teal.200" : "gray.200"}
        _hover={{
          bgColor: "teal.300",
        }}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          // if (post.voteStatus === -1) {
          //   return;
          // }
          setLoadingState("downdoot-loading");
          await vote({
            postId: post.id,
            value: -1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot"
        icon={<ChevronDownIcon boxSize="24px" />}
        mt={2}
        size="sm"
        bgColor={post.voteStatus === -1 ? "red.200" : "gray.200"}
        _hover={{
          bgColor: "red.300",
        }}
      />
    </Flex>
  );
};
