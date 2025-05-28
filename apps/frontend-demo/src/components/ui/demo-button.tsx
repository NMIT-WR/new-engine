import { Button, type ButtonProps, buttonVariants } from 'ui/src/atoms/button'
import { tv } from 'ui/src/utils'

const demoButton = tv({
  extend: buttonVariants,
  base: '',
  variants: {
    size: {
      default: '',
    },
  },
})

interface DemoButtonProps extends Omit<ButtonProps, 'size'> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
}

export const DemoButton = ({ size, ...props }: DemoButtonProps) => {
  // Map custom sizes to Button sizes
  const buttonSize = size === 'xl' || size === 'icon' ? 'lg' : size
  return <Button size={buttonSize} {...props} />
}
