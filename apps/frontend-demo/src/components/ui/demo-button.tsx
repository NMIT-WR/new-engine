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

interface DemoButtonProps extends ButtonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon'
}

export const DemoButton = ({ size, ...props }: DemoButtonProps) => {
  return <Button size={size} {...props}></Button>
}
