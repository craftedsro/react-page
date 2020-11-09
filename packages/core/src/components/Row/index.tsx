import classNames from 'classnames';
import * as React from 'react';
import { useMeasure } from 'react-use';
import { isRow, Node, Row } from '../../types/editable';
import { useBlurAllCells, useNodeHoverPosition, useNodeProps } from '../hooks';
import Droppable from './Droppable';
import ResizableRowCell from './ResizableRowCell';

const reduceToIdAndSizeArray = (
  acc: { offset: number; id: string }[],
  node: Node,
  index: number
) => {
  const size = isRow(node) ? 12 : node.size;
  return [
    ...acc,
    {
      id: node.id,
      offset: size + (acc[index - 1]?.offset ?? 0),
    },
  ];
};
const Row: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const [ref, { width: rowWidth }] = useMeasure();

  const blurAllCells = useBlurAllCells();
  const hoverPosition = useNodeHoverPosition(nodeId);

  const childrenWithOffsets = useNodeProps(nodeId, (node) =>
    isRow(node)
      ? node.cells?.reduce(reduceToIdAndSizeArray, []) ?? []
      : node.rows?.reduce(reduceToIdAndSizeArray, []) ?? []
  );

  const rowHasInlineChildrenPosition = useNodeProps(
    nodeId,
    (node) => isRow(node) && node.cells.length === 2 && node.cells[0]?.inline
  );

  return (
    <Droppable nodeId={nodeId}>
      <div
        ref={ref}
        className={classNames('react-page-row', {
          'react-page-row-is-hovering-this': Boolean(hoverPosition),
          [`react-page-row-is-hovering-${hoverPosition || ''}`]: Boolean(
            hoverPosition
          ),
          'react-page-row-has-floating-children': Boolean(
            rowHasInlineChildrenPosition
          ),
        })}
        style={{ position: 'relative', borderColor: 'red' }}
        onClick={blurAllCells}
      >
        {childrenWithOffsets.map(({ offset, id }, index) => (
          <ResizableRowCell
            key={id}
            isLast={index === childrenWithOffsets.length - 1}
            rowWidth={rowWidth}
            nodeId={id}
            rowHasInlineChildrenPosition={rowHasInlineChildrenPosition}
            offset={offset}
          />
        ))}
      </div>
    </Droppable>
  );
};

export default React.memo(Row);
