import './styles.css'

import { useState } from 'react'

export type RangeProps = {
  name: string
  defaultValue: string
  max?: number
  min?: number
  step?: number
  disabled?: boolean
  handleChange: (value: string) => void
}

export function Range({
  name,
  defaultValue,
  max,
  min,
  step,
  disabled,
  handleChange,
}: RangeProps) {
  const [value, setValue] = useState(defaultValue)

  return (
    <div className='range'>
      <input
        disabled={disabled}
        type='range'
        min={min ?? 0}
        max={max ?? 100}
        step={step ?? 1}
        id={name}
        value={value}
        onChange={(e) => {
          handleChange(e.target.value)
          setValue(e.target.value)
        }}
      />
    </div>

  )
}


