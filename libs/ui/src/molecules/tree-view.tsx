import { normalizeProps, useMachine } from '@zag-js/react'
import * as tree from '@zag-js/tree-view'
import { useId } from 'react'
import { type VariantProps, tv } from 'tailwind-variants'
import { Icon, type IconType } from '../atoms/icon'

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
  [key: string]: unknown
}

// === COMPONENT VARIANTS ===
const treeVariants = tv({
  slots: {
    root: 'relative bg-tree-root-bg',
    label: ['text-tree-label-fg font-tree-label'],
    tree: [
      'outline-none bg-tree-bg',

      'focus-visible:ring-2 focus-visible:ring-tree-node-focus focus-visible:ring-offset-2',
    ],
    branch: [
      'data-[disabled]:opacity-tree-disabled data-[disabled]:pointer-events-none',
    ],
    branchControl: [],
    branchText: ['flex-1 text-tree-size'],
    branchIndicator: [
      'data-[state=open]:token-icon-tree-indicator-open cursor-pointer hover:scale-120',
    ],
    branchContent: ['relative', 'data-[state=closed]:hidden'],
    branchIndentGuide: [
      'absolute top-0 bottom-0 left-1',
      'w-tree-indent bg-tree-indent',
      'opacity-tree-indent',
    ],
    leaf: [],
    nodeIcon: [
      //"flex-shrink-0",
      'text-tree-icon hover:text-tree-icon-hover',
    ],
  },
  compoundSlots: [
    {
      // leaf has a common style with branch and branchControl
      slots: ['branch', 'leaf'],
      class: [
        'relative',
        // get --depth from zag-js api
        'ml-[calc(var(--depth)*var(--tree-indent-per-level))]',
        'data-[depth=1]:ml-0',
      ],
    },
    {
      slots: ['branchControl', 'leaf'],
      class: [
        'flex items-center gap-tree-icon p-tree-node',
        'cursor-pointer rounded-tree-node',
        'hover:bg-tree-node-hover hover:text-tree-fg-hover hover:font-tree-selected',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tree-node-focus',
        'data-[selected]:bg-tree-node-selected data-[selected]:text-tree-fg-selected data-[selected]:font-tree-selected',
        'data-[disabled]:cursor-not-allowed data-[disabled]:hover:bg-transparent',
      ],
    },
  ],
})

// === TREE NODE COMPONENT ===
interface TreeNodeProps extends tree.NodeProps {
  api: tree.Api
  showIndentGuides?: boolean
  showNodeIcons?: boolean
}

function TreeNode({
  node,
  indexPath,
  api,
  showIndentGuides = true,
  showNodeIcons = true,
}: TreeNodeProps) {
  const nodeProps = { indexPath, node }
  const nodeState = api.getNodeState(nodeProps)

  const {
    branch,
    branchControl,
    branchText,
    branchIndicator,
    branchContent,
    branchIndentGuide,
    leaf,
    nodeIcon,
  } = treeVariants()

  const handleToggle = (id: string) => {
    if (nodeState.expanded) {
      api.collapse([id])
    } else {
      api.expand([id])
    }
  }

  if (nodeState.isBranch) {
    return (
      <div className={branch()} {...api.getBranchProps(nodeProps)}>
        <div className="flex items-center">
          <div
            className={branchControl()}
            {...api.getBranchControlProps(nodeProps)}
          >
            {showNodeIcons && (
              <Icon
                icon={
                  node.icons?.branch ||
                  (nodeState.expanded
                    ? 'token-icon-tree-node-open'
                    : 'token-icon-tree-node')
                }
                className={nodeIcon()}
                data-state={nodeState.expanded ? 'open' : 'closed'}
              />
            )}
            <span
              className={branchText()}
              {...api.getBranchTextProps(nodeProps)}
            >
              {node.name}
            </span>
          </div>
          <Icon
            icon="token-icon-tree-indicator"
            className={branchIndicator()}
            {...api.getBranchIndicatorProps(nodeProps)}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleToggle(node.id)
            }}
          />
        </div>
        <div
          className={branchContent()}
          {...api.getBranchContentProps(nodeProps)}
        >
          {showIndentGuides && (
            <div
              className={branchIndentGuide()}
              {...api.getBranchIndentGuideProps(nodeProps)}
            />
          )}
          {node.children?.map((childNode: TreeNode, index: number) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              indexPath={[...indexPath, index]}
              api={api}
              showIndentGuides={showIndentGuides}
              showNodeIcons={showNodeIcons}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={leaf()} {...api.getItemProps(nodeProps)}>
      {showNodeIcons && (
        <Icon
          icon={node.icons?.leaf || 'token-icon-tree-item'}
          className={nodeIcon()}
        />
      )}
      <span className={branchText()}>{node.name}</span>
    </div>
  )
}

// === MAIN COMPONENT ===
interface TreeProps extends VariantProps<typeof treeVariants>, tree.Props {
  data: TreeNode[]
  className?: string
  label?: string
  showIndentGuides?: boolean
  showNodeIcons?: boolean
}

export function TreeView({
  data,
  label,
  showIndentGuides = true,
  showNodeIcons = true,

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
  className,
  id: providedId,
  ...props
}: TreeProps) {
  const generatedId = useId()
  const id = providedId || generatedId

  const collection = tree.collection<TreeNode>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: { id: 'ROOT', name: '', children: data },
  })

  const service = useMachine(tree.machine, {
    id,
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
    //devtools: true,
    onExpandedChange,
    onSelectionChange,
    onFocusChange,
  })

  const api = tree.connect(service as unknown as tree.Service, normalizeProps)

  const { root, label: labelSlot, tree: treeSlot } = treeVariants()

  return (
    <div className={root({ className })} {...api.getRootProps()} {...props}>
      {label && (
        <h3 className={labelSlot()} {...api.getLabelProps()}>
          {label}
        </h3>
      )}
      <div className={treeSlot()} {...api.getTreeProps()}>
        {data.map((node, index) => (
          <TreeNode
            key={node.id}
            node={node}
            indexPath={[index]}
            api={api}
            showIndentGuides={showIndentGuides}
            showNodeIcons={showNodeIcons}
          />
        ))}
      </div>
    </div>
  )
}

TreeView.displayName = 'TreeView'
