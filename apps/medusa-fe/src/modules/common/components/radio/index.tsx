const Radio = ({
  checked,
  'data-testid': dataTestId,
}: { checked: boolean; 'data-testid'?: string }) => {
  return (
    <>
      <button
        type="button"
        role="radio"
        aria-checked="true"
        data-state={checked ? 'checked' : 'unchecked'}
        className="group relative flex h-5 w-5 items-center justify-center outline-none"
        data-testid={dataTestId || 'radio-button'}
      >
        <div className="group-focus:!shadow-borders-interactive-with-focus group-disabled:!bg-ui-bg-disabled group-disabled:!shadow-borders-base flex h-[14px] w-[14px] items-center justify-center rounded-full bg-ui-bg-base shadow-borders-base transition-all group-hover:shadow-borders-strong-with-shadow group-data-[state=checked]:bg-ui-bg-interactive group-data-[state=checked]:shadow-borders-interactive">
          {checked && (
            <span
              data-state={checked ? 'checked' : 'unchecked'}
              className="group flex items-center justify-center"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-ui-bg-base shadow-details-contrast-on-bg-interactive group-disabled:bg-ui-fg-disabled group-disabled:shadow-none"></div>
            </span>
          )}
        </div>
      </button>
    </>
  )
}

export default Radio
