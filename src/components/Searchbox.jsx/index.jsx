import React, { useState } from 'react';
import SearchIcon from '../../assets/icons/search';
import CloseIcon2 from '../../assets/icons/close2';

export default function Searchbox({ query, setQuery, handleSubmit, handleReset }) {
  return (
    <form
      name='searchbox'
      onSubmit={handleSubmit}
      onReset={handleReset}
      className={`flex items-center p-2 h-11 gap-2 border-[#D9D9D9] bg-white shadow-search rounded-lg`}
    >
      <div className=''>
        <SearchIcon />
      </div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          if (e.target.value.trim().length === 0) handleReset();
        }}
        className='w-full truncate'
        type='text'
        placeholder='Search by name, ID, mobile number'
      />
      {query ? (
        <div className='flex gap-1'>
          <button type='reset' className='flex p-1 justify-center items-center'>
            <CloseIcon2 />
          </button>
          <button
            type='submit'
            className='flex justify-center items-center px-[10px] py-[5px] rounded-3xl bg-primary-red active:opacity-90'
          >
            <span className='text-center text-xs not-italic font-semibold text-white'>Search</span>
          </button>
        </div>
      ) : null}
    </form>
  );
}
