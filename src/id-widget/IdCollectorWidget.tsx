import React, { useEffect, useState } from "react";
import { UiItemsProvider, Widget, WidgetState, StagePanelLocation, StagePanelSection } from "@itwin/appui-react";
import { IModelApp } from "@itwin/core-frontend";
import { Presentation } from "@itwin/presentation-frontend";
import { LabeledInput } from "@itwin/itwinui-react";
import { ElementProps } from "@itwin/core-common";
import { Id64Arg } from "@itwin/core-bentley";

export const IdCollectorWidget = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  useEffect(() => {
    const removeSelectionListener = Presentation.selection.selectionChange.addListener(async () => {
      const iModel = IModelApp.viewManager.selectedView?.view.iModel;
      if (iModel) {
        const selection = Presentation.selection.getSelection(iModel);
        if (selection.isEmpty) {
          setSelectedId(null);
          setSelectedLabel(null);
        } else {
          const ids = Array.from(selection.instanceKeys.values().next().value);
          setSelectedId(ids.join(', '));
  
          // Query the properties of each selected instance
          const elementProps: ElementProps[] = await iModel.elements.getProps(ids as Id64Arg);
          const label = elementProps ? elementProps.map( item => item.userLabel).join(', ') : null;
          setSelectedLabel(label ? label : '');
        }
      } else {
        setSelectedId(null);
        setSelectedLabel(null);
      }
    });
  
    return () => {
      removeSelectionListener();
    };
  }, []);

  // Return a JSX element
  return (
    <>
      <LabeledInput label="Selected ID" value={selectedId ?? ''} readOnly />
      <LabeledInput label="Selected Label" value={selectedLabel ?? ''} readOnly />
    </>
  );
};

export class IdCollectorWidgetProvider implements UiItemsProvider {
  public readonly id: string = "IdCollectorWidgetProvider";

  public provideWidgets(_stageId: string, _stageUsage: string, location: StagePanelLocation, _section?: StagePanelSection): ReadonlyArray<Widget> {
    const widgets: Widget[] = [];
    if (location === StagePanelLocation.Right) {
      widgets.push(
        {
          id: "IdCollectorWidget",
          label: "Id Collector",
          defaultState: WidgetState.Open,
          content: <IdCollectorWidget />,
        }
      );
    }
    return widgets;
  }
}