import { useGlobalSetting } from "../../hooks";
import type { GlobalSetting } from "../../stores";
import WButton from "../WButton";
import WForm from "../WForm";
import WFormItem from "../WFormItem";
import WInputNumber from "../WInputNumber";
import WSwitch from "../WSwitch";
import "./GlobalSettingForm.css";
import { AnimatePresence, motion } from "motion/react";
import TooltipSvg from "../../assets/tooltip.svg?react";

type GlobalSettingFormProps = {
  show: boolean;
  onSaveSuccess?: () => void;
};

export default function GlobalSettingForm({
  show,
  onSaveSuccess,
}: GlobalSettingFormProps) {
  const [globalSetting, setGlobalSetting] = useGlobalSetting();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
    value: GlobalSetting,
  ) => {
    e.preventDefault();
    setGlobalSetting(value);
    onSaveSuccess?.();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="setting-form-box"
          style={{ originX: "right", originY: "bottom" }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
        >
          <h4 className="setting-form-title">微博PC直播弹幕助手插件配置</h4>
          <WForm<GlobalSetting>
            className="setting-form"
            initialValues={globalSetting}
            labelCol={11}
            wrapperCol={12}
            onSubmit={handleSubmit}
          >
            <WFormItem
              label="自动搜寻直播间"
              name="autoSearchLive"
              tooltip={{
                icon: <TooltipSvg />,
                title: (
                  <>
                    启用后如果主播关闭直播后，会自动
                    <br />
                    搜寻主播的新直播间。
                  </>
                ),
              }}
            >
              <WSwitch />
            </WFormItem>
            <WFormItem
              label="自动跳转直播间"
              name="autoRedirectLive"
              tooltip={{
                icon: <TooltipSvg />,
                title: "启用后在找到新直播间时，会自动跳转至该直播间。",
              }}
            >
              <WSwitch />
            </WFormItem>
            <WFormItem
              label="弹幕刷新间隔"
              name="requestGap"
              tooltip={{
                icon: <TooltipSvg />,
                title: (
                  <>
                    控制弹幕获取频率，单位为秒。最小为3s。
                    <br />
                    在此基础上会有0-3s的随机间隔，防止风控。
                  </>
                ),
              }}
            >
              <WInputNumber min={3} addonAfter="s" />
            </WFormItem>
            <WFormItem
              label="弹幕上限"
              name="maxCommentsNum"
              tooltip={{
                icon: <TooltipSvg />,
                title: (
                  <>
                    设置弹幕列表最多保留的弹幕数量，
                    <br />
                    超过后会删除最早的弹幕。
                  </>
                ),
              }}
            >
              <WInputNumber min={200} max={800} precision={0} />
            </WFormItem>
            <WFormItem
              label="弹幕速度"
              name="commentSpeed"
              tooltip={{
                icon: <TooltipSvg />,
                title: (
                  <>
                    设置弹幕在屏幕上显示的时间（持续时间），
                    <br />
                    数值越大，弹幕停留越久。
                  </>
                ),
              }}
            >
              <WInputNumber min={5} max={20} addonAfter="s" />
            </WFormItem>
            <WFormItem>
              <WButton type="submit">保存配置</WButton>
            </WFormItem>
          </WForm>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
