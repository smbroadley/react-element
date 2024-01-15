import React from 'react'
import ReactElement from './ReactElement'

import { library, icon, Icon, IconName } from '@fortawesome/fontawesome-svg-core';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(far)


class IconComponent extends React.Component<{name: string}> {
    icon: Icon
    
    constructor(props: IconComponent['props']) {
        super(props)
        this.icon = icon({prefix: "far", iconName: this.props.name as IconName})
    }

    render() {
        return <FontAwesomeIcon icon={this.icon} />
    }
}

ReactElement.register(IconComponent, "re-icon", ["name"], {});