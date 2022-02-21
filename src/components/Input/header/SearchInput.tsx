import styled from 'styled-components';
import { AiOutlineSearch } from 'react-icons/ai';
import React, { useRef } from 'react';
const SearchInput = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const handleEnter = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      formRef.current?.onsubmit;
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    alert(searchRef.current?.value);
  };
  return (
    <Form onSubmit={handleSubmit} name="form" ref={formRef}>
      <input type="text" name="search" onKeyDown={handleEnter} ref={searchRef} />
      <DivSearch>
        <button type="submit">
          <AiOutlineSearch size="24" type="submit" />
        </button>
      </DivSearch>
    </Form>
  );
};

export default SearchInput;

const Form = styled.form`
  position: relative;
  border: 1px solid #888;
  border-radius: 4px;
  overflow: hidden;
  input {
    height: 2em;
    width: 100%;
  }
`;

const DivSearch = styled.div`
  position: absolute;
  height: 2em;
  top: 10%;
  right: 0;
  cursor: pointer;
`;
