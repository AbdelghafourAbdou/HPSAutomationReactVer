export default function EnvConfig() {
    return (
        <div className='environmentConfig'>
            <div className='config'>
                <h1 className='configTitle'>Database Configuration</h1>
                <p>Local DATABASE</p>
                <p>127.0.0.1</p>
                <p>1521</p>
                <p>pcard</p>
                <p>POWERCARD</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button>Reconnect</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
            <div className='config'>
                <h1 className='configTitle'>Server Configuration</h1>
                <p>Local JBOSS</p>
                <p>127.0.0.1</p>
                <p>8080</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
            <div className='config'>
                <h1 className='configTitle'>UNIX Configuration</h1>
                <p>Local JBOSS</p>
                <p>127.0.0.1</p>
                <p>8080</p>
                <div className='configButtons'>
                    <button>Test</button>
                    <button className='editButton'>Edit</button>
                </div>
            </div>
        </div>
    )
}
