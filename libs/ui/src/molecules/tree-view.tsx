import { normalizeProps, useMachine } from '@zag-js/react'
import * as tree from '@zag-js/tree-view'
import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  createContext,
  useContext,
  useId,
} from 'react'
import type { VariantProps } from 'tailwind-variants'
import { Icon, type IconType } from '../atoms/icon'
import { tv } from '../utils'

// === COLLECTION TYPES ===
export interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  icons?: {
    branch?: IconType
    leaf?: IconType
  }
  disabled?: boolean
  selected?: boolean
  selectable?: boolean // For 'custom' selection behavior
  [key: string]: unknown
}

// === COMPONENT VARIANTS ===
const treeViewVariants = tv({
  slots: {
    root: 'relative bg-tree-root-bg rounded-tree',
    label: ['text-tree-label-fg font-tree-label'],
    tree: [
      'outline-none bg-tree-bg',
      'focus-visible:ring',
      'focus-visible:ring-tree-ring',
    ],
    branch: [
      'data-[disabled]:text-tree-fg-disabled data-[disabled]:pointer-events-none',
    ],
    branchTrigger: [
      'group flex items-center justify-between',
      'hover:bg-tree-node-bg-hover',
      'cursor-pointer',
      'has-focus-visible:outline-none',
      'has-focus-visible:ring',
      'has-focus-visible:ring-tree-ring',
    ],
    branchControl: ['flex-1'],
    branchText: ['flex-1'],
    branchIndicator: [
      'group-hover:text-tree-fg-hover',
      'data-[state=open]:token-icon-tree-indicator-open cursor-pointer hover:scale-125',
    ],
    branchContent: ['relative', 'data-[state=closed]:hidden'],
    indentGuide: [
      'absolute top-0 bottom-0 start-1',
      'w-tree-indent bg-tree-indent-bg',
      'opacity-tree-indent',
    ],
    item: [
      'hover:bg-tree-node-bg-hover hover:text-tree-fg-hover',
      'data-[selected]:hover:bg-tree-node-bg-hover',
      'data-[selected]:hover:text-tree-fg-hover',
      'focus-visible:outline-none',
      'focus-visible:ring',
      'focus-visible:ring-tree-ring',
    ],
    itemText: ['flex-1'],
    nodeIcon: ['hover:text-tree-icon-hover'],
  },
  compoundSlots: [
    {
      // leaf has a common style with branch
      slots: ['branch', 'item'],
      class: [
        'relative',
        // get --depth from zag-js api
        'ms-(calc(var(--depth)*var(--tree-indent-per-level)))',
        'data-[depth=1]:ms-0',
      ],
    },
    {
      slots: ['branchControl', 'item'],
      class: [
        'flex items-center gap-tree-icon p-tree-node',
        'cursor-pointer',
        'data-[selected]:text-tree-fg-selected',
        'group-hover:text-tree-fg-hover',
        'data-[selected]:group-hover:text-tree-fg-hover',
        'focus-visible:outline-none',
      ],
    },
  ],
  variants: {
    size: {
      sm: {
        nodeIcon: 'text-tree-icon-sm',
        branchText: 'text-tree-sm',
        itemText: 'text-tree-sm',
        branchIndicator: 'text-tree-indicator-sm',
        label: 'text-tree-sm',
      },
      md: {
        nodeIcon: 'text-tree-icon-md',
        branchText: 'text-tree-md',
        itemText: 'text-tree-md',
        branchIndicator: 'text-tree-indicator-md',
        label: 'text-tree-md',
      },
      lg: {
        nodeIcon: 'text-tree-icon-lg',
        branchText: 'text-tree-lg',
        itemText: 'text-tree-lg',
        branchIndicator: 'text-tree-indicator-lg',
        label: 'text-tree-lg',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

// === CONTEXTS ===
// Main context for sharing tree state
interface TreeViewContextValue {
  api: tree.Api
  size?: 'sm' | 'md' | 'lg'
  styles: ReturnType<typeof treeViewVariants>
  selectionBehavior?: 'all' | 'leaf-only' | 'custom'
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null)

function useTreeViewContext() {
  const context = useContext(TreeViewContext)
  if (!context) {
    throw new Error('TreeView components must be used within TreeView.Root')
  }
  return context
}

// Node context for sharing node-specific state
interface TreeViewNodeContextValue {
  node: TreeNode
  indexPath: number[]
  nodeProps: tree.NodeProps
  nodeState: tree.NodeState
}

const TreeViewNodeContext = createContext<TreeViewNodeContextValue | null>(null)

function useTreeViewNodeContext() {
  const context = useContext(TreeViewNodeContext)
  if (!context) {
    throw new Error(
      'TreeView node components must be used within a node provider'
    )
  }
  return context
}

// === ROOT COMPONENT ===
interface TreeViewRootProps
  extends VariantProps<typeof treeViewVariants>,
    Omit<tree.Props, 'id' | 'size'>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'dir'> {
  id?: string
  data: TreeNode[]
  selectionBehavior?: 'all' | 'leaf-only' | 'custom'
}

export function TreeView({
  id,
  data,
  size,
  selectionBehavior = 'all',

  // Zag.js props
  dir = 'ltr',
  selectionMode = 'single',
  expandedValue,
  selectedValue,
  focusedValue,
  defaultExpandedValue,
  defaultSelectedValue,
  expandOnClick = true,
  typeahead = true,
  onExpandedChange,
  onSelectionChange,
  onFocusChange,

  children,
  className,
  ...props
}: TreeViewRootProps) {
  const generatedId = useId()
  const uniqueId = id || generatedId

  const collection = tree.collection<TreeNode>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: { id: 'ROOT', name: '', children: data },
  })

  const service = useMachine(tree.machine, {
    id: uniqueId,
    collection,
    dir,
    selectionMode,
    expandedValue,
    selectedValue,
    focusedValue,
    defaultExpandedValue,
    defaultSelectedValue,
    expandOnClick,
    typeahead,
    onExpandedChange,
    onSelectionChange,
    onFocusChange,
  })

  const api = tree.connect(service as unknown as tree.Service, normalizeProps)
  const styles = treeViewVariants({ size })

  return (
    <TreeViewContext.Provider value={{ api, size, styles, selectionBehavior }}>
      <div
        className={styles.root({ className })}
        {...api.getRootProps()}
        {...props}
      >
        {children}
      </div>
    </TreeViewContext.Provider>
  )
}

// === LABEL COMPONENT ===
interface TreeViewLabelProps extends ComponentPropsWithoutRef<'h3'> {}

TreeView.Label = function TreeViewLabel({
  children,
  className,
  ...props
}: TreeViewLabelProps) {
  const { api, styles } = useTreeViewContext()

  return (
    <h3
      className={styles.label({ className })}
      {...api.getLabelProps()}
      {...props}
    >
      {children}
    </h3>
  )
}

// === TREE CONTAINER COMPONENT ===
interface TreeViewTreeProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.Tree = function TreeViewTree({
  children,
  className,
  ...props
}: TreeViewTreeProps) {
  const { api, styles } = useTreeViewContext()

  return (
    <div
      className={styles.tree({ className })}
      {...api.getTreeProps()}
      {...props}
    >
      {children}
    </div>
  )
}

// === NODE PROVIDER COMPONENT ===
interface TreeViewNodeProviderProps {
  node: TreeNode
  indexPath: number[]
  children: ReactNode
}

TreeView.NodeProvider = function TreeViewNodeProvider({
  node,
  indexPath,
  children,
}: TreeViewNodeProviderProps) {
  const { api } = useTreeViewContext()
  const nodeProps = { node, indexPath }
  const nodeState = api.getNodeState(nodeProps)

  return (
    <TreeViewNodeContext.Provider
      value={{ node, indexPath, nodeProps, nodeState }}
    >
      {children}
    </TreeViewNodeContext.Provider>
  )
}

// === BRANCH COMPONENT ===
interface TreeViewBranchProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.Branch = function TreeViewBranch({
  children,
  className,
  ...props
}: TreeViewBranchProps) {
  const { api, styles } = useTreeViewContext()
  const { nodeProps } = useTreeViewNodeContext()

  return (
    <div
      className={styles.branch({ className })}
      {...api.getBranchProps(nodeProps)}
      {...props}
    >
      {children}
    </div>
  )
}

// === BRANCH TRIGGER COMPONENT ===
interface TreeViewBranchTriggerProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.BranchTrigger = function TreeViewBranchTrigger({
  children,
  className,
  ...props
}: TreeViewBranchTriggerProps) {
  const { styles } = useTreeViewContext()

  return (
    <div className={styles.branchTrigger({ className })} {...props}>
      {children}
    </div>
  )
}

// === BRANCH CONTROL COMPONENT ===
interface TreeViewBranchControlProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.BranchControl = function TreeViewBranchControl({
  children,
  className,
  ...props
}: TreeViewBranchControlProps) {
  const { api, styles, selectionBehavior } = useTreeViewContext()
  const { node, nodeProps, nodeState } = useTreeViewNodeContext()

  // Determine if this branch can be selected
  const isSelectable = (() => {
    switch (selectionBehavior) {
      case 'all':
        return true
      case 'leaf-only':
        return false
      case 'custom':
        return node.selectable !== false
      default:
        return true
    }
  })()

  // Get props based on selectability
  const controlProps = api.getBranchControlProps(nodeProps)

  // Modify props if not selectable
  const finalProps = isSelectable
    ? controlProps
    : {
        ...controlProps,
        onClick: (e: MouseEvent<HTMLDivElement>) => {
          e.preventDefault()
          e.stopPropagation()
          // Allow toggle on click for non-selectable branches
          if (!nodeState.disabled) {
            if (nodeState.expanded) {
              api.collapse([node.id])
            } else {
              api.expand([node.id])
            }
          }
        },
        'aria-selected': undefined,
        'data-disabled': !isSelectable || nodeState.disabled || undefined,
      }

  return (
    <div
      className={styles.branchControl({ className })}
      {...finalProps}
      {...props}
    >
      {children}
    </div>
  )
}

// === BRANCH TEXT COMPONENT ===
interface TreeViewBranchTextProps {
  children?: ReactNode
  className?: string
}

TreeView.BranchText = function TreeViewBranchText({
  children,
  className,
}: TreeViewBranchTextProps) {
  const { api, styles } = useTreeViewContext()
  const { node, nodeProps } = useTreeViewNodeContext()

  return (
    <span
      className={styles.branchText({ className })}
      {...api.getBranchTextProps(nodeProps)}
    >
      {children || node.name}
    </span>
  )
}

// === BRANCH INDICATOR COMPONENT ===
interface TreeViewBranchIndicatorProps {
  icon?: IconType
  className?: string
}

TreeView.BranchIndicator = function TreeViewBranchIndicator({
  icon = 'token-icon-tree-indicator',
  className,
}: TreeViewBranchIndicatorProps) {
  const { api, styles } = useTreeViewContext()
  const { node, nodeProps, nodeState } = useTreeViewNodeContext()

  const handleToggle = (id: string) => {
    if (nodeState.expanded) {
      api.collapse([id])
    } else {
      api.expand([id])
    }
  }

  return (
    <Icon
      icon={icon}
      className={styles.branchIndicator({ className })}
      {...api.getBranchIndicatorProps(nodeProps)}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        handleToggle(node.id)
      }}
    />
  )
}

// === BRANCH CONTENT COMPONENT ===
interface TreeViewBranchContentProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.BranchContent = function TreeViewBranchContent({
  children,
  className,
  ...props
}: TreeViewBranchContentProps) {
  const { api, styles } = useTreeViewContext()
  const { nodeProps } = useTreeViewNodeContext()

  return (
    <div
      className={styles.branchContent({ className })}
      {...api.getBranchContentProps(nodeProps)}
      {...props}
    >
      {children}
    </div>
  )
}

// === INDENT GUIDE COMPONENT ===
interface TreeViewIndentGuideProps {
  className?: string
}

TreeView.IndentGuide = function TreeViewIndentGuide({
  className,
}: TreeViewIndentGuideProps) {
  const { api, styles } = useTreeViewContext()
  const { nodeProps } = useTreeViewNodeContext()

  return (
    <div
      className={styles.indentGuide({ className })}
      {...api.getBranchIndentGuideProps(nodeProps)}
    />
  )
}

// === ITEM COMPONENT (LEAF) ===
interface TreeViewItemProps extends ComponentPropsWithoutRef<'div'> {}

TreeView.Item = function TreeViewItem({
  children,
  className,
  ...props
}: TreeViewItemProps) {
  const { api, styles, selectionBehavior } = useTreeViewContext()
  const { node, nodeProps, nodeState } = useTreeViewNodeContext()

  // Determine if this item can be selected
  const isSelectable = (() => {
    switch (selectionBehavior) {
      case 'all':
      case 'leaf-only':
        return true
      case 'custom':
        return node.selectable !== false
      default:
        return true
    }
  })()

  // Get props based on selectability
  const itemProps = api.getItemProps(nodeProps)

  // Modify props if not selectable
  const finalProps = isSelectable
    ? itemProps
    : {
        ...itemProps,
        onClick: (e: MouseEvent<HTMLDivElement>) => {
          e.preventDefault()
          e.stopPropagation()
        },
        'aria-selected': undefined,
        'data-disabled': !isSelectable || nodeState.disabled || undefined,
      }

  return (
    <div
      className={styles.item({ className })}
      {...finalProps}
      data-selected={nodeState.selected || undefined}
      {...props}
    >
      {children}
    </div>
  )
}

// === ITEM TEXT COMPONENT ===
interface TreeViewItemTextProps {
  children?: ReactNode
  className?: string
}

TreeView.ItemText = function TreeViewItemText({
  children,
  className,
}: TreeViewItemTextProps) {
  const { api, styles } = useTreeViewContext()
  const { node, nodeProps } = useTreeViewNodeContext()

  return (
    <span
      className={styles.itemText({ className })}
      {...api.getItemTextProps(nodeProps)}
    >
      {children || node.name}
    </span>
  )
}

// === NODE ICON COMPONENT ===
interface TreeViewNodeIconProps extends ComponentPropsWithoutRef<'span'> {
  icon?: IconType
}

TreeView.NodeIcon = function TreeViewNodeIcon({
  icon,
  className,
  ...props
}: TreeViewNodeIconProps) {
  const { styles } = useTreeViewContext()
  const { node, nodeState } = useTreeViewNodeContext()

  // Determine which icon to show
  const iconToShow =
    icon ||
    (nodeState.isBranch
      ? node.icons?.branch ||
        (nodeState.expanded
          ? 'token-icon-tree-node-open'
          : 'token-icon-tree-node')
      : node.icons?.leaf || 'token-icon-tree-item')

  return (
    <span
      className={styles.nodeIcon({ className })}
      data-state={nodeState.expanded ? 'open' : 'closed'}
      {...props}
    >
      <Icon icon={iconToShow} />
    </span>
  )
}

// === HELPER NODE COMPONENT ===
// This component provides a default implementation using all subcomponents
interface TreeViewNodeProps {
  node: TreeNode
  indexPath: number[]
  showIndentGuides?: boolean
  showNodeIcons?: boolean
  onNodeHover?: (node: TreeNode, indexPath: number[]) => void
  onNodeLeave?: (node: TreeNode, indexPath: number[]) => void
}

TreeView.Node = function TreeViewNode({
  node,
  indexPath,
  showIndentGuides = true,
  showNodeIcons = true,
  onNodeHover,
  onNodeLeave,
}: TreeViewNodeProps) {
  const { api } = useTreeViewContext()
  const nodeProps = { node, indexPath }
  const nodeState = api.getNodeState(nodeProps)

  return (
    <TreeView.NodeProvider node={node} indexPath={indexPath}>
      {nodeState.isBranch ? (
        <TreeView.Branch>
          <TreeView.BranchTrigger
            onMouseEnter={() => onNodeHover?.(node, indexPath)}
            onMouseLeave={() => onNodeLeave?.(node, indexPath)}
          >
            <TreeView.BranchControl>
              {showNodeIcons && <TreeView.NodeIcon />}
              <TreeView.BranchText />
            </TreeView.BranchControl>
            <TreeView.BranchIndicator />
          </TreeView.BranchTrigger>
          <TreeView.BranchContent>
            {showIndentGuides && <TreeView.IndentGuide />}
            {node.children?.map((childNode, index) => (
              <TreeView.Node
                key={childNode.id}
                node={childNode}
                indexPath={[...indexPath, index]}
                showIndentGuides={showIndentGuides}
                showNodeIcons={showNodeIcons}
                onNodeHover={onNodeHover}
                onNodeLeave={onNodeLeave}
              />
            ))}
          </TreeView.BranchContent>
        </TreeView.Branch>
      ) : (
        <TreeView.Item
          onMouseEnter={() => onNodeHover?.(node, indexPath)}
          onMouseLeave={() => onNodeLeave?.(node, indexPath)}
        >
          {showNodeIcons && <TreeView.NodeIcon />}
          <TreeView.ItemText />
        </TreeView.Item>
      )}
    </TreeView.NodeProvider>
  )
}

// Export main component with all subcomponents
TreeView.displayName = 'TreeView'
