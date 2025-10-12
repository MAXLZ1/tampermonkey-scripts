import "./index.css";
import { createPortal } from "react-dom";
import {
  useState,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
} from "react";
import { AnimatePresence, motion } from "motion/react";

export type TooltipProps = {
  children?: React.ReactNode;
  title?: React.ReactNode;
};

function mergeEvent<T extends React.SyntheticEvent>(
  original?: (e: T) => void,
  added?: (e: T) => void,
) {
  return (e: T) => {
    original?.(e);
    added?.(e);
  };
}

export default function Tooltip(props: TooltipProps) {
  const { children, title } = props;
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const ref = useRef<any>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setVisible(true);
  };
  const handleMouseLeave = () => {
    setVisible(false);
  };

  let childNode: React.ReactNode;

  if (isValidElement(children)) {
    const element = children as React.ReactElement<any, any>;
    childNode = cloneElement(children as React.ReactElement<any, any>, {
      ref,
      onMouseEnter: mergeEvent(element?.props.onMouseEnter, handleMouseEnter),
      onMouseLeave: mergeEvent(element?.props.onMouseLeave, handleMouseLeave),
    });
  } else {
    childNode = (
      <span
        ref={ref}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
    );
  }

  useEffect(() => {
    if (!visible || !ref.current) return;
    if (!tooltipRef.current) return;

    const rect = ref.current.getBoundingClientRect();
    const tooltopReact = tooltipRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

    // 计算相对于 document 的位置
    setPosition({
      top: rect.top + scrollTop - tooltopReact.height - 15, // 上方偏移 30px
      left: rect.left + scrollLeft - tooltopReact.width / 2, // 水平居中
    });
  }, [visible]);

  return (
    <>
      {childNode}
      {createPortal(
        <div>
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ y: 6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 6, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                  mass: 0.5,
                }}
                ref={tooltipRef}
                className="w-tooltip"
                style={{ left: position.left, top: position.top }}
              >
                <div className="w-tooltip-arrow"></div>
                <div className="w-tooltip-content">{title}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </>
  );
}
