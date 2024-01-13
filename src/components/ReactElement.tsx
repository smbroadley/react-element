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

export class ReactElement<T extends React.Component, P = T['props']> extends HTMLElement {
    root: ReactDOM.Root

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
                super(type, convert)
            }
        }

        window.customElements?.define(name, ReactElementImpl)
    }

    private comp: new (props: P) => T
    private conv: any

    constructor(comp: { new(props: P): T }, conv: any) {
        super()

        this.comp = comp
        this.conv = conv
    }

    getProps() {
        type X = {
            [K in keyof P]: boolean
        }

        // TODO: last bit!!
        return { name: "Stephen", age: 41 }
    }

    connectedCallback() {
        this.root = ReactDOM.createRoot(this)
        this.root.render(<this.comp {...this.getProps()} />)
    }
    
    disconnectedCallback() {
        this.root.unmount()
    }
}


