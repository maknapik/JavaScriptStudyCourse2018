import React from 'react';
import { mount } from 'react-mounter';

import {MainLayout} from "./layouts/MainLayout";

import App  from "../imports/ui/App";

FlowRouter.route('/', {
   action() {
       mount(
           MainLayout,
           {
               content: (<App content="hello" />)
           }
       )
    }
});