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
}) {
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
        {selectList.map((el) => (
          <option className={classNameOption} value={el} key={el}>
            {el}
          </option>
        ))}
      </select>
    </div>
  );
}
