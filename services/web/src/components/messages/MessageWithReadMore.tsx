'use client';
const MAX_CHARACTERS = 200;
import React, { useState } from 'react';

const MessageWithReadMore: React.FC<{ message: string }> = ({ message }) => {
  const [showFullMessage, setShowFullMessage] = useState(false);

  const truncatedMessage = message.slice(0, MAX_CHARACTERS);
  const shouldShowReadMore = message.length > MAX_CHARACTERS;

  const handleReadMoreClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowFullMessage(true);
  };

  return (
    <td className="">
      <div
        dangerouslySetInnerHTML={{
          __html: showFullMessage ? message : truncatedMessage,
        }}
      />
      {shouldShowReadMore && !showFullMessage && (
        <a href="#" onClick={handleReadMoreClick} className="font-bold">
          Read More
        </a>
      )}
    </td>
  );
};

export default MessageWithReadMore;
