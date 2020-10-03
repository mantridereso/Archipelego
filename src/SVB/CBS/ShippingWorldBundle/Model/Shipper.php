<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 15:49
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class Shipper
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="Actor,Shipper")
 */
class Shipper implements ShipperInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     */
    private $name;

    /**
     * @var ArrayCollection
     *
     * @OGM\ManyToMany(relation="owned_by",direction="to")
     */
    private $ships;

    public function __construct(){
        $this->ships = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return ArrayCollection
     */
    public function getShips()
    {
        return $this->ships;
    }

    /**
     * @param int $id
     * @return Shipper
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param string $name
     * @return Shipper
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @param ArrayCollection $ships
     * @return Shipper
     */
    public function setShips($ships)
    {
        $this->ships = $ships;
        return $this;
    }

}