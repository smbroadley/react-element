import React from 'react'
import ReactDOM from 'react-dom/client'

type NonStringFields<T> = {
    [K in keyof T]: T[K] extends string ? never : K;
}

type StringConv<T extends {[prop:string]:any}> = {
    [K in keyof T]: (val: string)=>T[K]
}

type PropConv<T> = StringConv< Pick<T, NonStringFields<T>[keyof T]> >

// ----------------------------------------------------------------------------------------------------------

export default class ReactElement<T extends React.Component, P = T['props']> extends HTMLElement {

    static register<C extends React.Component, CP = C['props'] >(
        type: { new(props: CP): C }, 
        name: string, 
        props: Array<keyof CP>,  // maybe just use the converters as the props we want to use?
        convert: PropConv<CP>) 
    {
        // we need to create a local class here so that we can pass the 'type' and 'conv'
        // arguments to the constructor: these are required to correctly instantiate the
        // React component, and convert the HTMLElement props to the correct type for the
        // component props.
        //
        class ReactElementImpl extends ReactElement<C> {
            constructor() {
                super(type, props as string[], convert)
            }
        }

        window.customElements?.define(name, ReactElementImpl)
    }

    private root: ReactDOM.Root
    private comp: new (props: P) => T
    private conv: any
    private props: string[]

    constructor(comp: { new(props: P): T }, props: string[], conv: any) {
        super()

        this.comp = comp
        this.conv = conv
        this.props = props
    }

    getProps(): P {
        const props: any = {}

        for( const name of this.props ) {
            const val = this.getAttribute(name)
            props[name] = this.conv[name]?.call(null, val) ?? val
        }

        return props as P
    }

    connectedCallback() {
        this.root = ReactDOM.createRoot(this)
        this.root.render( <this.comp {...this.getProps()} /> )
    }
    
    disconnectedCallback() {
        this.root.unmount()
    }
}


