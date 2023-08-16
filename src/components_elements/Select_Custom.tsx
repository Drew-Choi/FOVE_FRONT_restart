import React, {
  Dispatch,
  MutableRefObject,
  PropsWithChildren,
  SetStateAction,
} from 'react';

// type
interface Select_CustomProps extends PropsWithChildren {
  onChangeEvent?: (e?: any) => void | Dispatch<SetStateAction<any>>;
  selectList: string[];
  inputRef?: MutableRefObject<HTMLSelectElement | null>;
  classNameSelect?: string;
  classNameOption?: string;
  classNameDiv?: string;
  name?: string;
  classNameChildren?: string;
  defaultValueSelect?: string;
  value?: string;
}

export default function Select_Custom({
  children,
  onChangeEvent,
  selectList,
  inputRef,
  classNameSelect,
  classNameOption,
  classNameDiv,
  name,
  classNameChildren,
  defaultValueSelect,
  value,
}: Select_CustomProps) {
  return (
    <div className={classNameDiv}>
      <p className={classNameChildren}>{children}</p>
      <select
        className={classNameSelect}
        ref={inputRef}
        onChange={onChangeEvent}
        name={name}
        defaultValue={defaultValueSelect}
        value={value}
      >
        {selectList.map((el: string, index: number) => (
          <option className={classNameOption} value={el} key={index}>
            {el}
          </option>
        ))}
      </select>
    </div>
  );
}
