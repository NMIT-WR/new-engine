'use client'
import { RangeSlider } from '@/components/range-slider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type React from 'react'
import { useEffect, useState } from 'react'
import { type UseRangeProps, useRange } from 'react-instantsearch'

export function RangeFilter(props: UseRangeProps) {
  const { start, range, canRefine, refine } = useRange(props)
  const step = 1 / 10

  const [sliderValues, setSliderValues] = useState<[number, number]>([0, 100])
  const [inputValues, setInputValues] = useState({
    from: '0',
    to: '100',
  })

  useEffect(() => {
    const minValue = range.min ?? 0
    const maxValue = range.max ?? 100
    const newStart: [number, number] = [
      start[0] !== undefined && start[0] !== Number.NEGATIVE_INFINITY
        ? start[0]
        : minValue,
      start[1] !== undefined && start[1] !== Number.POSITIVE_INFINITY
        ? start[1]
        : maxValue,
    ]
    setSliderValues(newStart)
    setInputValues({
      from: newStart[0].toString(),
      to: newStart[1].toString(),
    })
  }, [start, range.min, range.max, refine])

  const handleSliderChange = (newValues: number[]) => {
    const typedValues: [number, number] = [newValues[0], newValues[1]]
    setSliderValues(typedValues)
    setInputValues({
      from: typedValues[0].toString(),
      to: typedValues[1].toString(),
    })
    refine(typedValues)
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'from' | 'to'
  ) => {
    const value = event.target.value
    setInputValues((prev) => ({ ...prev, [type]: value }))
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const minValue = range.min ?? 0
    const maxValue = range.max ?? 100
    const newValues: [number, number] = [
      inputValues.from ? Number(inputValues.from) : minValue,
      inputValues.to ? Number(inputValues.to) : maxValue,
    ]
    setSliderValues(newValues)
    refine(newValues)
  }

  const stripLeadingZeroFromInput = (value: string): string => {
    return value.replace(/^(0+)\d/, (part) => Number(part).toString())
  }

  return (
    <div className="w-full py-2">
      <RangeSlider
        min={range.min ?? 0}
        max={range.max ?? 100}
        step={step}
        value={sliderValues}
        onValueChange={handleSliderChange}
        disabled={!canRefine}
        className="mb-4 w-full"
      />
      <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
        <Input
          type="number"
          min={range.min ?? 0}
          max={range.max ?? 100}
          value={stripLeadingZeroFromInput(inputValues.from)}
          step={step}
          placeholder={(range.min ?? 0).toString()}
          disabled={!canRefine}
          onChange={(e) => handleInputChange(e, 'from')}
          className="w-20 rounded border px-2 py-1"
        />
        <span>to</span>
        <Input
          type="number"
          min={range.min ?? 0}
          max={range.max ?? 100}
          value={stripLeadingZeroFromInput(inputValues.to)}
          step={step}
          placeholder={(range.max ?? 100).toString()}
          disabled={!canRefine}
          onChange={(e) => handleInputChange(e, 'to')}
          className="w-20 rounded border px-2 py-1"
        />
        <Button type="submit" className="rounded px-3 py-1">
          Go
        </Button>
      </form>
    </div>
  )
}
