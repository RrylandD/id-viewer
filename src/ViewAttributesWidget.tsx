import React from "react";
import { StagePanelLocation, StagePanelSection, UiItemsProvider, Widget, WidgetState  } from "@itwin/appui-react";
import { RenderMode } from "@itwin/core-common";
import { IModelApp } from "@itwin/core-frontend";
import { SvgHelpCircularHollow } from "@itwin/itwinui-icons-react";
import { Alert, IconButton, Select, Slider, Text, ToggleSwitch, Tooltip } from "@itwin/itwinui-react";
import { AttrValues, ViewAttributesApi, ViewFlag } from "./ViewAttributesApi";
import "./ViewAttributes.scss";

export const ViewAttributesWidget = () => {
  const [attrValuesState, setAttrValuesState] = React.useState<AttrValues>(() => ViewAttributesApi.settings);

  const onChangeRenderMode = (renderMode: RenderMode) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setRenderMode(vp, renderMode);
      setAttrValuesState({ ...attrValuesState, renderMode });
    }
  };

  // Handle changes to the skybox toggle.
  const onChangeSkyboxToggle = (checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setSkyboxOnOff(vp, checked);
    }
  };

  // Handle changes to the camera toggle.
  const onChangeCameraToggle = (checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setCameraOnOff(vp, checked);
    }
  };

  // Handle changes to a view flag toggle.
  const onChangeViewFlagToggle = (flag: ViewFlag, checked: boolean) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setViewFlag(vp, flag, checked);
      attrValuesState.viewFlags = { ...attrValuesState.viewFlags, [flag]: checked };
      setAttrValuesState({ ...attrValuesState });
    }
  };

  // Handle changes to a view flag toggle.
  const onMapTransparencyChange = (num: number) => {
    const vp = IModelApp.viewManager.selectedView;
    if (vp) {
      ViewAttributesApi.setBackgroundTransparency(vp, num);
      setAttrValuesState({ ...attrValuesState, backgroundTransparency: num });
    }
  };

  const Help = ({ text }: { text: string }) => (
    <Tooltip content={text}>
      <IconButton styleType="borderless" size="small"><SvgHelpCircularHollow /></IconButton>
    </Tooltip>
  );

  return (
    <div className="sample-options">
      <div className="sample-grid">
        <div className="sample-control">
          <Help text="Controls the render mode."></Help>
          <Text>Render Mode</Text>
          <Select
            size="small"
            value={attrValuesState.renderMode}
            options={renderModelOptions}
            onChange={onChangeRenderMode} />
        </div>
        <div className="sample-control">
          <Help text="Click to see the iModel on a map. Click again to disable map. Does not apply if the selected iModel is not geolocated."></Help>
          <Text>Background Map</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.backgroundMap} onChange={() => onChangeViewFlagToggle("backgroundMap", !attrValuesState.viewFlags.backgroundMap)} />
        </div>
        <div className="sample-control">
          <Help text="Adjusting the slider changes the transparency of the background map. Does not apply if map is not currently being displayed."></Help>
          <Text>Map Transparency</Text>
          <Slider min={0} max={1} step={0.01} values={[attrValuesState.backgroundTransparency]} onChange={(values) => onMapTransparencyChange(values[0])} disabled={!attrValuesState.viewFlags.backgroundMap}></Slider>
        </div>
        <div className="sample-control">
          <Help text="Click to see a visualization of the active coordinate system."></Help>
          <Text>ACS</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.acsTriad} onChange={() => onChangeViewFlagToggle("acsTriad", !attrValuesState.viewFlags.acsTriad)} />
        </div>
        <div className="sample-control">
          <Help text="Click for perspective view. Click again for orthographic view."></Help>
          <Text>Camera</Text>
          <ToggleSwitch checked={attrValuesState.cameraOn} onChange={() => onChangeCameraToggle(!attrValuesState.cameraOn)} />
        </div>
        <div className="sample-control">
          <Help text="Toggle grid view."></Help>
          <Text>Grid</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.grid} onChange={() => onChangeViewFlagToggle("grid", !attrValuesState.viewFlags.grid)} />
        </div>
        <div className="sample-control">
          <Help text="Click to disable colors."></Help>
          <Text>Monochrome</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.monochrome} onChange={() => onChangeViewFlagToggle("monochrome", !attrValuesState.viewFlags.monochrome)} />
        </div>
        <div className="sample-control">
          <Help text="Click to see shadows."></Help>
          <Text>Shadows</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.shadows} onChange={() => onChangeViewFlagToggle("shadows", !attrValuesState.viewFlags.shadows)} />
        </div>
        <div className="sample-control">
          <Help text="Click to see the sky box."></Help>
          <Text>Sky box</Text>
          <ToggleSwitch checked={attrValuesState.skybox} onChange={() => onChangeSkyboxToggle(!attrValuesState.skybox)} />
        </div>
        <div className="sample-control">
          <Help text="Click to disable visible edges. Only applies to smooth shade render mode."></Help>
          <Text>Visible Edges</Text>
          <ToggleSwitch checked={attrValuesState.viewFlags.visibleEdges} onChange={() => onChangeViewFlagToggle("visibleEdges", !attrValuesState.viewFlags.visibleEdges)} />
        </div>
        <div className="sample-control">
          <Help text="Click to see hidden edges.  Does not apply to wireframe. For smooth shade render mode, does not apply when visible edges are off."></Help>
          <Text>Hidden Edges</Text>
          <ToggleSwitch
            checked={attrValuesState.viewFlags.hiddenEdges}
            onChange={() => onChangeViewFlagToggle("hiddenEdges", !attrValuesState.viewFlags.hiddenEdges)}
            disabled={attrValuesState.renderMode === RenderMode.Wireframe || (attrValuesState.renderMode === RenderMode.SmoothShade && !attrValuesState.viewFlags.visibleEdges)} />
        </div>
      </div>
      <Alert type="informational" className="instructions">
        Use the controls to change the view attributes.
      </Alert>
    </div>
  );
};

const renderModelOptions = [
  { value: RenderMode.HiddenLine, label: "Hidden Line" },
  { value: RenderMode.SmoothShade, label: "Smooth Shade" },
  { value: RenderMode.SolidFill, label: "Solid Fill" },
  { value: RenderMode.Wireframe, label: "Wireframe" },
];

export class ViewAttributesWidgetProvider implements UiItemsProvider {
  public readonly id: string = "ViewAttributesWidgetProvider";

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push(
        {
          id: "ViewAttributesWidget",
          label: "View Attributes Controls",
          defaultState: WidgetState.Open,
          content: <ViewAttributesWidget />,
        }
      );
    }
    return widgets;
  }
}