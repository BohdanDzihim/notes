import React from 'react';

const Footer = ({ totalNotes }) => {
  return (
    <footer>
      {totalNotes === 0 ? "0 Notes" : totalNotes === 1 ? "1 Note" : `${totalNotes} Notes`}
    </footer>
  )
}

export default Footer