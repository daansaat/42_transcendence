type Props<T> = {
  items: T[],
  renderItem: (item: T) => JSX.Element,
  onClickItem: (item: T) => void,
}

export function ClickableList<T>({ items, renderItem, onClickItem }: Props<T>) {
  return (
    <>
      {items.map((item, index) => (
        <div key={index} onClick={() => onClickItem(item)}>
          {renderItem(item)}
        </div>
      ))}
    </>
  );
}
