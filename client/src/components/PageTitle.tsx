import React from 'react';

type TitleProps = {
  title: string;
};

const PageTitle = ({ title }: TitleProps) => {
  return (
    <div className="mt-2">
      <h1 className="text-white text-2xl">{title}</h1>
    </div>
  );
};

export default PageTitle;
