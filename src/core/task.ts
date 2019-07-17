import { SvelteRow } from "./row";
import { SvelteGantt } from "./gantt";

export interface TaskModel {
    id: number; // | string;
    resourceId: number; // | string
    from: any; // moment
    to: any; // moment

    amountDone?: number;
    classes?: string | string[];
    label?: string;
    html?: string;
    showButton?: boolean;
    buttonClasses?: string | string[];
    buttonHtml?: string;
    enableDragging?: boolean;
}

export interface SvelteTask {
    model: TaskModel;

    left: number;
    top: number;
    width: number;

    height: number;
}

export class TaskFactory {
    gantt: SvelteGantt;

    constructor(gantt: SvelteGantt) {
        this.gantt = gantt;
    }

    createTask(model: TaskModel): SvelteTask {
        
        // id of task, every task needs to have a unique one
        //task.id = task.id || undefined;
        // completion %, indicated on task
        model.amountDone = model.amountDone || 0;
        // css classes
        model.classes = model.classes || '';
        // datetime task starts on, currently moment-js object
        model.from = model.from || null;
        // datetime task ends on, currently moment-js object
        model.to = model.to || null;
        // label of task
        model.label = model.label || undefined;
        // html content of task, will override label
        model.html = model.html || undefined;
        // show button bar
        model.showButton = model.showButton || false 
        // button classes, useful for fontawesome icons
        model.buttonClasses = model.buttonClasses || ''
        // html content of button
        model.buttonHtml = model.buttonHtml || ''
        // enable dragging of task
        model.enableDragging = model.enableDragging === undefined ? true : model.enableDragging;
        
        const left = this.gantt.utils.getPositionByDate(model.from);
        const right = this.gantt.utils.getPositionByDate(model.to); 

        return {
            model,
            left: left,
            width: right-left,
            height: this.getHeight(model),
            top: this.getPosY(model)
        }
    }

    row(resourceId): SvelteRow{
        return this.gantt.store.get().rowMap[resourceId];
    }

    getHeight(model){
        return this.row(model.resourceId).height - 2 * this.gantt.store.get().rowPadding;
    }

    getPosY(model){
        return this.row(model.resourceId).posY + this.gantt.store.get().rowPadding;
    }
}

function overlap(one: SvelteTask, other: SvelteTask){
    return !(one.left + one.width <= other.left || one.left >= other.left + other.width);
}
