var optionsValidator = require('../src/optionsValidator');

var validOptions = optionsValidator(
	{
		id: 'myId',
		devTag: 'myDevTag',
		initialPath: 'path/',
		creds: { key: 'myKey', secret: 'mySecret' }
	}
);

var releaseOptions = optionsValidator(
	{	
		id: 'myId',
		version: '1.2.0',
		initialPath: 'path/',
		creds: { key: 'myKey', secret: 'mySecret' }
	}
);

describe( 'options validator', function() {

	describe( 'arguments', function() {

		it( 'should throw with undefined options', function() {
			var options = optionsValidator();
			expect( function() { options.getId(); } ).to.throw( 'Missing options' );
		} );

		it( 'should throw with null options', function() {
			var options = optionsValidator( null );
			expect( function() { options.getId(); } ).to.throw( 'Missing options' );
		} );

	} );

	describe( 'id', function() {

		it( 'should throw with no id', function() {
			var options = optionsValidator({});
			expect( function() { options.getId(); } ).to.throw( 'Missing id' );
		} );

		it( 'should return specified id', function() {
			expect( validOptions.getId() ).to.equal( 'myId' );
		} );

	} );

	describe( 'devTag', function() {

		it( 'should throw with no devTag', function() {
			var options = optionsValidator( { id: 'id' } );
			expect( function() {
					options.getDevTag();
				} ).to.throw( 'Missing devTag' );
		} );

		it( 'should return specified devTag', function() {
			expect( validOptions.getDevTag() ).to.equal( 'myDevTag' );
		} );

	} );

	describe( 'version', function() {

		it( 'should throw with no version', function() {
			var options = optionsValidator( { id: 'id' } );
			expect( function() {
					options.getVersion();
				} ).to.throw( 'Missing version' );
		} );

		it( 'should throw with wrong semantic version', function() {
			var options = optionsValidator( { id: 'id', version: '1.2.3.4' } );
			expect( function() {
					options.getVersion();
				} ).to.throw( 'Version number is not valid according to Semantic Versioning.' );
		} );

		it( 'should return specified version', function() {
			expect( releaseOptions.getVersion() ).to.equal( '1.2.0' );
		} );

	});

	describe( 'creds', function() {

		it( 'should throw with no credentials', function() {
			var options = optionsValidator( { id: 'id', devTag: 'tag' } );
			expect( function() {
					options.getCreds();
				} ).to.throw( 'Missing credentials' );
		} );

		it( 'should throw with no credentials key', function() {
			var options = optionsValidator(
				{ id: 'id', devTag: 'tag', creds: {} }
			);
			expect( function() {
					options.getCreds();
				} ).to.throw( 'Missing credential key' );
		} );

		it( 'should throw with no credentials secret', function() {
			var options = optionsValidator(
				{ id: "id", devTag: "devTag", creds: { key: "key" } }
			);
			expect( function() {
					options.getCreds();
				} ).to.throw( 'Missing credential secret' );
		} );

		it( 'should return specified creds', function() {

			expect( validOptions.getCreds().key ).to.equal( 'myKey' );
			expect( validOptions.getCreds().secret ).to.equal( 'mySecret' );
		} );

	} );

	describe( 'getUploadPath', function() {

		it( 'should return valid upload path', function() {
			expect( validOptions.getUploadPath() )
				.to.equal( 'path/myId/dev/myDevTag/' );
		} );

		it( 'should return valid release upload path', function() {
			expect( releaseOptions.getUploadPath() )
				.to.equal( 'path/myId/1.2.0/' );
		} );

		it( 'should prioritize release version over devTag', function() {
			var options = optionsValidator(
				{	
					id: 'myId',
					devTag: 'tag',
					version: '2.2.0',
					initialPath: 'path/',
					creds: { key: 'myKey', secret: 'mySecret' }
				}
			);
			expect( options.getUploadPath() )
				.to.equal( 'path/myId/2.2.0/' );
		} );

	} );

} );